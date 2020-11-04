import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { makePiece, testStore } from '../../utils/testData';
import { Piece } from '../../services/ChessService.types';
import config from '../../config';
import TakenPieces from './TakenPieces';
import { clearTaken, addPieces } from '../../store/activeGame/activeGame';
import { sendAlert } from '../../store/notifications/notifications';

const takenBlackRook = makePiece('ROOK', 'BLACK', 0, 0, 'TAKEN');

const mockStore = createMockStore(getDefaultMiddleware());
const mockedStore = mockStore({
  ...testStore,
  activeGame: {
    ...testStore.activeGame,
    pieces: {
      ids: [takenBlackRook.id],
      entities: {
        [takenBlackRook.id]: { ...takenBlackRook }
      }
    }
  }
});

const server = setupServer(
  rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
    return res(
      ctx.json<Piece[]>([takenBlackRook])
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
      type: addPieces.type
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
      type: sendAlert.type
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
      type: clearTaken.type
    })
  );
});
