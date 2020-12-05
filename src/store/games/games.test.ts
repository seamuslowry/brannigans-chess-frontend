import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import createMockStore from 'redux-mock-store';
import config from '../../config';
import { AllGameData, Game, PageResponse } from '../../services/ChessService.types';
import { allGameData, emptyGame, fullGame, testStore } from '../../utils/testData';
import reducer, {
  createGame,
  getAllGameData,
  getStatusTopic,
  initialState,
  joinGame,
  leaveGame
} from '../games/games';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';
import { AppState } from '../store';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.post(`${config.serviceUrl}/games/create`, (req, res, ctx) => {
    return res(ctx.json<Game>(emptyGame));
  }),
  rest.post(`${config.serviceUrl}/players/join/0`, (req, res, ctx) => {
    return res(ctx.json<Game>(fullGame));
  }),
  rest.post(`${config.serviceUrl}/players/leave/0`, (req, res, ctx) => {
    return res(ctx.json<Game>(fullGame));
  }),
  rest.post(`${config.serviceUrl}/games/0`, (req, res, ctx) => {
    return res(ctx.json<AllGameData>(allGameData));
  }),
  rest.get(`${config.serviceUrl}/games`, (req, res, ctx) => {
    return res(
      ctx.json<PageResponse<Game>>({
        content: [],
        totalPages: 0,
        totalElements: 0
      })
    );
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

test('tries to join a game', async () => {
  await waitFor(() => mockedStore.dispatch(joinGame({ gameId: 0, pieceColor: 'WHITE' })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: joinGame.fulfilled.type
    })
  );
});

test('dispatches an error when failing to join a game', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/players/join/0`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  await waitFor(() => mockedStore.dispatch(joinGame({ gameId: 0, pieceColor: 'WHITE' })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: joinGame.rejected.type
    })
  );
});

test('dispatches an error when failing to join a game from conflict', async () => {
  const message = 'conflict';
  server.use(
    rest.post(`${config.serviceUrl}/players/join/0`, (req, res, ctx) => {
      return res(ctx.status(409), ctx.json(message));
    })
  );
  await waitFor(() => mockedStore.dispatch(joinGame({ gameId: 0, pieceColor: 'WHITE' })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: joinGame.rejected.type,
      error: expect.objectContaining({
        message: expect.stringContaining(message)
      })
    })
  );
});

test('does not handle joining a game', async () => {
  const result = reducer(
    undefined,
    joinGame.fulfilled(emptyGame, '', { gameId: 0, pieceColor: 'WHITE' })
  );

  expect(result).toEqual(initialState);
});

test('tries to leave a game', async () => {
  await waitFor(() => mockedStore.dispatch(leaveGame(0)));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: leaveGame.fulfilled.type
    })
  );
});

test('dispatches an error when failing to leave a game', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/players/leave/0`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  await waitFor(() => mockedStore.dispatch(leaveGame(0)));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: leaveGame.rejected.type
    })
  );
});

test('dispatches an error when failing to leave a game from conflict', async () => {
  const message = 'conflict';
  server.use(
    rest.post(`${config.serviceUrl}/players/leave/0`, (req, res, ctx) => {
      return res(ctx.status(409), ctx.json(message));
    })
  );
  await waitFor(() => mockedStore.dispatch(leaveGame(0)));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: leaveGame.rejected.type,
      error: expect.objectContaining({
        message: expect.stringContaining(message)
      })
    })
  );
});

test('does not handle leaving a game', async () => {
  const result = reducer(undefined, leaveGame.fulfilled(emptyGame, '', 0));

  expect(result).toEqual(initialState);
});

test('tries to get all game data', async () => {
  await waitFor(() => mockedStore.dispatch(getAllGameData(0)));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: getAllGameData.fulfilled.type
    })
  );
});
