import { AppState } from '@auth0/auth0-react/dist/auth0-provider';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import createMockStore from 'redux-mock-store';
import config from '../../config';
import { Piece } from '../../services/ChessService.types';
import {
  blackRook,
  makePiece,
  mockEntityAdapterState,
  testStore,
  whiteEnPassant,
  whiteKingSideCastle,
  whiteMove,
  whiteQueenSideCastle,
  whiteTake
} from '../../utils/testData';
import { clickTile } from '../boards/boards';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';
import { getSharedMovesTopic } from '../moves/moves';
import reducer, { addPieces, getPieces, initialState } from './pieces';

const server = setupServer(
  rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
    return res(
      ctx.json<Piece[]>([blackRook])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('adds pieces', () => {
  const result = reducer(undefined, addPieces([blackRook]));

  expect(result.ids).toContain(blackRook.id);
});

test('handles a taken piece on shared move on the move topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getSharedMovesTopic(1),
      data: JSON.stringify(whiteTake)
    }
  });

  expect(result.ids).toContain(whiteTake.takenPiece?.id);
});

test('handles a stomp message on an unrelated topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: 'not-a-topic',
      data: 'test'
    }
  });

  expect(result).toEqual(initialState);
});

test('moves a piece - reducer', async () => {
  const request = { row: whiteMove.dstRow, col: whiteMove.dstCol, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(whiteMove, '', request));

  expect(result.entities[whiteMove.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteMove.dstRow,
      positionCol: whiteMove.dstCol
    })
  );
});

test('moves to take a piece - reducer', async () => {
  const request = { row: whiteTake.dstRow, col: whiteTake.dstCol, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(whiteTake, '', request));

  expect(result.entities[whiteTake.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteTake.dstRow,
      positionCol: whiteTake.dstCol
    })
  );
  expect(result.entities[whiteTake.takenPiece?.id || -1]).toEqual(
    expect.objectContaining({
      status: 'TAKEN'
    })
  );
});

test('en passants a piece - reducer', async () => {
  const request = { row: whiteEnPassant.dstRow, col: whiteEnPassant.dstCol, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(whiteEnPassant, '', request));

  expect(result.entities[whiteEnPassant.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteEnPassant.dstRow,
      positionCol: whiteEnPassant.dstCol
    })
  );
  expect(result.entities[whiteEnPassant.takenPiece?.id || -1]).toEqual(
    expect.objectContaining({
      status: 'TAKEN'
    })
  );
});

test('king side castles - reducer', async () => {
  const request = { row: whiteKingSideCastle.dstRow, col: whiteKingSideCastle.dstCol, gameId: 0 };
  const whiteRook = makePiece(
    'ROOK',
    'BLACK',
    whiteKingSideCastle.dstRow,
    whiteKingSideCastle.dstCol + 1
  );
  const result = reducer(
    mockEntityAdapterState(whiteKingSideCastle.movingPiece, whiteRook),
    clickTile.fulfilled(whiteKingSideCastle, '', request)
  );

  expect(result.entities[whiteKingSideCastle.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteKingSideCastle.dstRow,
      positionCol: whiteKingSideCastle.dstCol
    })
  );
  expect(result.entities[whiteRook.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteKingSideCastle.dstRow,
      positionCol: whiteKingSideCastle.dstCol - 1
    })
  );
});

test('queen side castles - reducer', async () => {
  const request = { row: whiteQueenSideCastle.dstRow, col: whiteQueenSideCastle.dstCol, gameId: 0 };
  const whiteRook = makePiece(
    'ROOK',
    'WHITE',
    whiteQueenSideCastle.dstRow,
    whiteQueenSideCastle.dstCol - 2
  );
  const result = reducer(
    mockEntityAdapterState(whiteQueenSideCastle.movingPiece, whiteRook),
    clickTile.fulfilled(whiteQueenSideCastle, '', request)
  );

  expect(result.entities[whiteQueenSideCastle.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteQueenSideCastle.dstRow,
      positionCol: whiteQueenSideCastle.dstCol
    })
  );
  expect(result.entities[whiteRook.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteQueenSideCastle.dstRow,
      positionCol: whiteQueenSideCastle.dstCol + 1
    })
  );
});

test('tries to get pieces', async () => {
  await waitFor(() => mockedStore.dispatch(getPieces({ gameId: 0, colors: ['BLACK'] })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: getPieces.fulfilled.type
    })
  );
});

test('dispatches an error when failing to get pieces', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  await waitFor(() => mockedStore.dispatch(getPieces({ gameId: 0, colors: [] })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: getPieces.rejected.type
    })
  );
});

test('handles successful piece retrival', async () => {
  const result = reducer(
    undefined,
    getPieces.fulfilled([blackRook], '', { gameId: 0, colors: ['BLACK'] })
  );

  expect(result.ids).toContain(blackRook.id);
});
