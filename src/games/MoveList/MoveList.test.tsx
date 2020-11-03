import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import thunk from 'redux-thunk';
import { testStore, whiteMove } from '../../utils/testData';
import { Move } from '../../services/ChessService.types';
import config from '../../config';
import MoveList from './MoveList';
import { addMoves, clearMoves } from '../../store/activeGame/activeGame';
import { sendAlert } from '../../store/notifications/notifications';

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
      type: addMoves.type
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
      type: sendAlert.type
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
      type: clearMoves.type
    })
  );
});
