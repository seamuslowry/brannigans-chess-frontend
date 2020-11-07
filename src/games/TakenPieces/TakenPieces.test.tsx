import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { makePiece, mockEntityAdapterState, testStore } from '../../utils/testData';
import { Piece } from '../../services/ChessService.types';
import config from '../../config';
import TakenPieces from './TakenPieces';
import { getPieces } from '../../store/pieces/pieces';

const takenBlackRook = makePiece('ROOK', 'BLACK', 0, 0, 'TAKEN');

const mockStore = createMockStore(getDefaultMiddleware());
const mockedStore = mockStore({
  ...testStore,
  activeGame: {
    ...testStore.activeGame,
    pieces: mockEntityAdapterState(takenBlackRook)
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
      type: getPieces.fulfilled.type
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
      type: getPieces.rejected.type
    })
  );
});
