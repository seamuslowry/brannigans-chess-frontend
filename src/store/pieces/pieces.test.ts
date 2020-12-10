import { AppState } from '@auth0/auth0-react/dist/auth0-provider';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import createMockStore from 'redux-mock-store';
import config from '../../config';
import { Piece } from '../../services/ChessService.types';
import {
  allGameData,
  blackRook,
  fullGame,
  makePiece,
  mockEntityAdapterState,
  testStore,
  whiteEnPassant,
  whiteKingSideCastle,
  whiteMove,
  whiteQueenSideCastle,
  whiteTake
} from '../../utils/testData';
import { dragMove } from '../boards/boards';
import { getAllGameData, joinGame, leaveGame } from '../games/games';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';
import { getSharedMovesTopic } from '../moves/moves';
import reducer, { addPieces, getPieces, initialState, promotePawn } from './pieces';

const server = setupServer(
  rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
    return res(
      ctx.json<Piece[]>([blackRook])
    );
  }),
  rest.post(`${config.serviceUrl}/pieces/promote/0/QUEEN`, (req, res, ctx) => {
    return res(ctx.json<Piece>(makePiece('QUEEN', 'WHITE')));
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

test('preemptively moves a piece - reducer', async () => {
  const request = {
    piece: whiteMove.movingPiece,
    to: { row: whiteMove.dstRow, col: whiteMove.dstCol }
  };
  const result = reducer(
    mockEntityAdapterState(whiteMove.movingPiece),
    dragMove.pending('', request)
  );

  expect(result.entities[whiteMove.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteMove.dstRow,
      positionCol: whiteMove.dstCol
    })
  );
});

test('reverts a piece move on fail - reducer', async () => {
  const request = {
    piece: whiteMove.movingPiece,
    to: { row: whiteMove.dstRow, col: whiteMove.dstCol }
  };
  const result = reducer(undefined, dragMove.rejected(new Error(''), '', request));

  expect(result.entities[whiteMove.movingPiece.id]).toEqual(whiteMove.movingPiece);
});

test('moves a piece - reducer', async () => {
  const request = {
    piece: whiteMove.movingPiece,
    to: { row: whiteMove.dstRow, col: whiteMove.dstCol }
  };
  const result = reducer(undefined, dragMove.fulfilled(whiteMove, '', request));

  expect(result.entities[whiteMove.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteMove.dstRow,
      positionCol: whiteMove.dstCol
    })
  );
});

test('moves to take a piece - reducer', async () => {
  const request = {
    piece: whiteTake.movingPiece,
    to: { row: whiteTake.dstRow, col: whiteTake.dstCol }
  };
  const result = reducer(undefined, dragMove.fulfilled(whiteTake, '', request));

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
  const request = {
    piece: whiteEnPassant.movingPiece,
    to: { row: whiteEnPassant.dstRow, col: whiteEnPassant.dstCol }
  };
  const result = reducer(undefined, dragMove.fulfilled(whiteEnPassant, '', request));

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
  const request = {
    piece: whiteKingSideCastle.movingPiece,
    to: { row: whiteKingSideCastle.dstRow, col: whiteKingSideCastle.dstCol }
  };
  const whiteRook = makePiece(
    'ROOK',
    'BLACK',
    whiteKingSideCastle.dstRow,
    whiteKingSideCastle.dstCol + 1
  );
  const result = reducer(
    mockEntityAdapterState(whiteKingSideCastle.movingPiece, whiteRook),
    dragMove.fulfilled(whiteKingSideCastle, '', request)
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
  const request = {
    piece: whiteQueenSideCastle.movingPiece,
    to: { row: whiteQueenSideCastle.dstRow, col: whiteQueenSideCastle.dstCol }
  };
  const whiteRook = makePiece(
    'ROOK',
    'WHITE',
    whiteQueenSideCastle.dstRow,
    whiteQueenSideCastle.dstCol - 2
  );
  const result = reducer(
    mockEntityAdapterState(whiteQueenSideCastle.movingPiece, whiteRook),
    dragMove.fulfilled(whiteQueenSideCastle, '', request)
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

test('tries to promote a piece', async () => {
  await waitFor(() => mockedStore.dispatch(promotePawn({ pieceId: 0, type: 'QUEEN' })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: promotePawn.fulfilled.type
    })
  );
});

test('dispatches an error when failing to promote a piece', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/pieces/promote/0/QUEEN`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  await waitFor(() => mockedStore.dispatch(promotePawn({ pieceId: 0, type: 'QUEEN' })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: promotePawn.rejected.type
    })
  );
});

test('handles successful piece promotion', async () => {
  const pawn = makePiece('PAWN', 'BLACK');
  const result = reducer(
    mockEntityAdapterState(pawn),
    promotePawn.fulfilled(blackRook, '', { pieceId: pawn.id, type: 'ROOK' })
  );

  expect(result.ids).toContain(blackRook.id);
  expect(result.entities[pawn.id]?.status).toEqual('REMOVED');
});

test('handles joining a game', async () => {
  const removePiece = makePiece('PAWN', 'BLACK');
  const result = reducer(
    mockEntityAdapterState(removePiece),
    joinGame.fulfilled(fullGame, '', { gameId: 0, pieceColor: 'WHITE' })
  );

  expect(result.ids).not.toContain(removePiece.id);
});

test('does not handle leaving a game', async () => {
  const result = reducer(undefined, leaveGame.fulfilled(fullGame, '', 0));

  expect(result).toEqual(initialState);
});

test('handles successful full game data retrival', async () => {
  const result = reducer(undefined, getAllGameData.fulfilled(allGameData, '', 0));

  expect(result.ids).toEqual(allGameData.pieces.map(m => m.id));
});

test('will not update unmodified pieces on full game update', async () => {
  const mockedState = mockEntityAdapterState(...allGameData.pieces);

  const result = reducer(
    mockedState,
    getAllGameData.fulfilled(
      {
        ...allGameData,
        pieces: [allGameData.pieces[0], { ...allGameData.pieces[1], status: 'REMOVED' }]
      },
      '',
      0
    )
  );

  expect(result.entities[allGameData.pieces[0].id]).toBe(
    mockedState.entities[allGameData.pieces[0].id]
  );
  expect(result.entities[allGameData.pieces[1].id]).not.toBe(
    mockedState.entities[allGameData.pieces[1].id]
  );
  expect(result.entities[allGameData.pieces[1].id]!.status).toEqual('REMOVED');
});
