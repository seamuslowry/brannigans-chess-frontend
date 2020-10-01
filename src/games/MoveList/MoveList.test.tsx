import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import thunk from 'redux-thunk';
import { testStore, whiteMove } from '../../utils/testData';
import { Move } from '../../services/ChessService';
import config from '../../config';
import MoveList from './MoveList';
import { ADD_MOVES, CLEAR_MOVES } from '../../store/activeGame/activeGame';
import { SEND_ALERT } from '../../store/notifications/notifications';

const mockStore = createMockStore([thunk]);
const mockedStore = mockStore({
  ...testStore,
  activeGame: {
    ...testStore.activeGame,
    moveList: [whiteMove]
  }
});

const server = setupServer(
  rest.get(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
    return res(
      ctx.json<Move[]>([whiteMove])
    );
  })
);

beforeEach(() => mockedStore.clearActions());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('gets moves on mount', async () => {
  const { getByRole } = render(
    <Provider store={mockedStore}>
      <MoveList gameId={0} color="BLACK" />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for service call to complete

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: ADD_MOVES
    })
  );
});

test('handles an error getting moves on mount', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const { getByRole } = render(
    <Provider store={mockedStore}>
      <MoveList gameId={0} color="BLACK" />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for service call to complete

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: SEND_ALERT
    })
  );
});

test('clears moves on unmount', async () => {
  const { getByRole, unmount } = render(
    <Provider store={mockedStore}>
      <MoveList gameId={0} color="BLACK" />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for service call to complete

  unmount();

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: CLEAR_MOVES
    })
  );
});
