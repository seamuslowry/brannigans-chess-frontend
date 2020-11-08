import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import createMockStore from 'redux-mock-store';
import config from '../../config';
import { Game } from '../../services/ChessService.types';
import { emptyGame, testStore } from '../../utils/testData';
import reducer, { createGame, getStatusTopic, initialState } from '../games/games';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';
import { AppState } from '../store';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.post(`${config.serviceUrl}/games/create`, (req, res, ctx) => {
    return res(ctx.json<Game>(emptyGame));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('handles an message on the status topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getStatusTopic(1),
      data: JSON.stringify(emptyGame)
    }
  });

  expect(result.ids).toContain(emptyGame.id);
});

test('handles a stomp message on an unrelated topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: 'not-a-match',
      data: 'test'
    }
  });

  expect(result).toEqual(initialState);
});

test('tries to create a game', async () => {
  await waitFor(() => mockedStore.dispatch(createGame()));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: createGame.fulfilled.type
    })
  );
});

test('dispatches an error when failing to create a game', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/games/create`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  await waitFor(() => mockedStore.dispatch(createGame()));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: createGame.rejected.type
    })
  );
});

test('handles successful game creation', async () => {
  const result = reducer(undefined, createGame.fulfilled(emptyGame, '', undefined));

  expect(result.ids).toContain(emptyGame.id);
});
