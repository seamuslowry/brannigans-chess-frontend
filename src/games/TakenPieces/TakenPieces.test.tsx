import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import thunk from 'redux-thunk';
import { blackRook, testStore } from '../../utils/testData';
import { Piece } from '../../services/ChessService.types';
import config from '../../config';
import TakenPieces from './TakenPieces';
import { CLEAR_TAKEN, TAKE_PIECES } from '../../store/activeGame/activeGame';
import { SEND_ALERT } from '../../store/notifications/notifications';

const mockStore = createMockStore([thunk]);
const mockedStore = mockStore({
  ...testStore,
  activeGame: {
    ...testStore.activeGame,
    takenPieces: [blackRook]
  }
});

const server = setupServer(
  rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
    return res(
      ctx.json<Piece[]>([blackRook])
    );
  })
);

beforeEach(() => mockedStore.clearActions());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('gets pieces on mount', async () => {
  const { getByRole } = render(
    <Provider store={mockedStore}>
      <TakenPieces gameId={0} color="BLACK" />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for service call to complete

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: TAKE_PIECES
    })
  );
});

test('handles an error getting pieces on mount', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const { getByRole } = render(
    <Provider store={mockedStore}>
      <TakenPieces gameId={0} color="BLACK" />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for service call to complete

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: SEND_ALERT
    })
  );
});

test('clears pieces on unmount', async () => {
  const { getByRole, unmount } = render(
    <Provider store={mockedStore}>
      <TakenPieces gameId={0} color="BLACK" />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for service call to complete

  unmount();

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: CLEAR_TAKEN
    })
  );
});
