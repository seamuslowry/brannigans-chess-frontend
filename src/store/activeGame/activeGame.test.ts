import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import createMockStore from 'redux-mock-store';
import reducer, {
  clearBoard,
  initialState,
  clearGame,
  ActiveGameState,
  clearTaken,
  addMoves,
  setGameId,
  clearMoves,
  getStatusTopic,
  getPieces,
  addPieces,
  clickTile
} from './activeGame';
import {
  blackRook,
  emptyGame,
  fullGame,
  makePiece,
  testStore,
  whiteEnPassant,
  whiteKingSideCastle,
  whiteMove,
  whiteQueenSideCastle,
  whiteTake
} from '../../utils/testData';
import { AppState } from '../store';
import config from '../../config';
import { Move, Piece } from '../../services/ChessService.types';
import { waitFor } from '@testing-library/dom';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';

const server = setupServer(
  rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
    return res(
      ctx.json<Piece[]>([blackRook])
    );
  }),
  rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
    return res(ctx.json<Move>(whiteMove));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('sets the global game id', () => {
  const result = reducer(undefined, setGameId(1));

  expect(result.id).toEqual(1);
});

test('clears all moves', () => {
  const result = reducer(undefined, clearMoves());

  expect(result.moves.ids).toEqual([]);
});

test('records a move', () => {
  const result = reducer(undefined, addMoves([whiteMove]));

  expect(result.moves.ids).toContainEqual(whiteMove.id);
});

test('records moves', () => {
  const result = reducer(undefined, addMoves([whiteMove]));

  expect(result.moves.ids).toContainEqual(whiteMove.id);
});

test('adds pieces', () => {
  const result = reducer(undefined, addPieces([blackRook]));

  expect(result.pieces.ids).toContain(blackRook.id);
});

test('clears the board', () => {
  const activePiece = makePiece('ROOK', 'WHITE');
  const whiteTakenPiece = makePiece('ROOK', 'WHITE', 0, 0, 'TAKEN');
  const blackTakenPiece = makePiece('ROOK', 'BLACK', 0, 0, 'TAKEN');
  const result = reducer(
    {
      ...initialState,
      pieces: {
        ids: [activePiece.id, whiteTakenPiece.id, blackTakenPiece.id],
        entities: {
          [activePiece.id]: activePiece,
          [whiteTakenPiece.id]: whiteTakenPiece,
          [blackTakenPiece.id]: blackTakenPiece
        }
      }
    },
    clearBoard()
  );

  expect(result.pieces.ids).not.toContain(activePiece.id);
  expect(result.pieces.ids).toContain(whiteTakenPiece.id);
  expect(result.pieces.ids).toContain(blackTakenPiece.id);
  expect(result.selectedPosition).toEqual(initialState.selectedPosition);
});

test('clears the game', () => {
  const result = reducer(undefined, clearGame());

  expect(result).toEqual(initialState);
});

test('clears taken pieces', () => {
  const takenWhiteRook = makePiece('ROOK', 'WHITE', 0, 0, 'TAKEN');
  const takenBlackRook = makePiece('ROOK', 'BLACK', 7, 0, 'TAKEN');

  const stateWithTakenPieces: ActiveGameState = {
    ...testStore.activeGame,
    pieces: {
      ids: [takenBlackRook.id, takenWhiteRook.id],
      entities: {
        [takenBlackRook.id]: { ...takenBlackRook },
        [takenWhiteRook.id]: { ...takenWhiteRook }
      }
    }
  };
  const result = reducer(stateWithTakenPieces, clearTaken('WHITE'));

  expect(result.pieces.ids).toContain(takenBlackRook.id);
  expect(result.pieces.ids).not.toContain(takenWhiteRook.id);
});

test('handles an empty game stomp message on the status topic', () => {
  const stateWithId: ActiveGameState = {
    ...testStore.activeGame,
    id: 1
  };
  const result = reducer(stateWithId, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getStatusTopic(1),
      data: JSON.stringify(emptyGame)
    }
  });

  expect(result.status).toEqual(emptyGame.status);
  expect(result.whitePlayer).toBeNull();
  expect(result.blackPlayer).toBeNull();
});

test('handles an full game stomp message on the status topic', () => {
  const stateWithId: ActiveGameState = {
    ...testStore.activeGame,
    id: 1
  };
  const result = reducer(stateWithId, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getStatusTopic(1),
      data: JSON.stringify(fullGame)
    }
  });

  expect(result.status).toEqual(fullGame.status);
  expect(result.whitePlayer).toEqual(fullGame.whitePlayer);
  expect(result.blackPlayer).toEqual(fullGame.blackPlayer);
});

test('handles a stomp message on an unrelated topic', () => {
  const stateWithId: ActiveGameState = {
    ...testStore.activeGame,
    id: 1
  };
  const result = reducer(stateWithId, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getStatusTopic(-1),
      data: JSON.stringify(emptyGame)
    }
  });

  expect(result).toEqual(stateWithId);
});

test('clicks an unselectable tile - action', async () => {
  await waitFor(() => mockedStore.dispatch(clickTile({ row: 0, col: 0 })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: null
    })
  );
});

test('clicks an unselectable tile - reducer', async () => {
  const position = { row: 0, col: 0 };
  const result = reducer(undefined, clickTile.fulfilled(null, '', position));

  expect(result.selectedPosition).toBeUndefined();
});

test('clicks an unselected tile - action', async () => {
  const piece = makePiece('ROOK', 'WHITE', 0, 0);
  const storeWithRook = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      pieces: {
        ids: [piece.id],
        entities: {
          [piece.id]: piece
        }
      }
    }
  });

  await waitFor(() => storeWithRook.dispatch(clickTile({ row: 0, col: 0 })));

  expect(storeWithRook.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: true
    })
  );
});

test('clicks an unselected tile - reducer', async () => {
  const position = { row: 0, col: 0 };
  const result = reducer(undefined, clickTile.fulfilled(true, '', position));

  expect(result.selectedPosition).toEqual(position);
});

test('clicks a selected tile - action', async () => {
  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: { row: 0, col: 0 }
    }
  });

  await waitFor(() => selectedStore.dispatch(clickTile({ row: 0, col: 0 })));

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: false
    })
  );
});

test('clicks a selected tile - reducer', async () => {
  const position = { row: 0, col: 0 };
  const result = reducer(undefined, clickTile.fulfilled(false, '', position));

  expect(result.selectedPosition).toBeUndefined();
});

test('moves a piece - action', async () => {
  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: { row: whiteMove.srcRow, col: whiteMove.srcCol }
    }
  });

  await waitFor(() =>
    selectedStore.dispatch(clickTile({ row: whiteMove.dstRow, col: whiteMove.dstCol }))
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: { ...whiteMove }
    })
  );
});

test('moves a piece - reducer', async () => {
  const position = { row: whiteMove.dstRow, col: whiteMove.dstCol };
  const result = reducer(undefined, clickTile.fulfilled(whiteMove, '', position));

  expect(result.selectedPosition).toBeUndefined();
  expect(result.pieces.entities[whiteMove.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteMove.dstRow,
      positionCol: whiteMove.dstCol
    })
  );
  expect(result.moves.ids).toContainEqual(whiteMove.id);
});

test('moves to take a piece - action', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.json(whiteTake));
    })
  );

  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: { row: whiteTake.srcRow, col: whiteTake.srcCol }
    }
  });

  await waitFor(() =>
    selectedStore.dispatch(clickTile({ row: whiteTake.dstRow, col: whiteTake.dstCol }))
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: { ...whiteTake }
    })
  );
});

test('moves to take a piece - reducer', async () => {
  const position = { row: whiteTake.dstRow, col: whiteTake.dstCol };
  const result = reducer(undefined, clickTile.fulfilled(whiteTake, '', position));

  expect(result.selectedPosition).toBeUndefined();
  expect(result.pieces.entities[whiteTake.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteTake.dstRow,
      positionCol: whiteTake.dstCol
    })
  );
  expect(result.pieces.entities[whiteTake.takenPiece?.id || -1]).toEqual(
    expect.objectContaining({
      status: 'TAKEN'
    })
  );
  expect(result.moves.ids).toContainEqual(whiteTake.id);
});

test('en passants a piece - action', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.json(whiteEnPassant));
    })
  );

  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: { row: whiteEnPassant.srcRow, col: whiteEnPassant.srcCol }
    }
  });

  await waitFor(() =>
    selectedStore.dispatch(clickTile({ row: whiteEnPassant.dstRow, col: whiteEnPassant.dstCol }))
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: { ...whiteEnPassant }
    })
  );
});

test('en passants a piece - reducer', async () => {
  const position = { row: whiteEnPassant.dstRow, col: whiteEnPassant.dstCol };
  const result = reducer(undefined, clickTile.fulfilled(whiteEnPassant, '', position));

  expect(result.selectedPosition).toBeUndefined();
  expect(result.pieces.entities[whiteEnPassant.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteEnPassant.dstRow,
      positionCol: whiteEnPassant.dstCol
    })
  );
  expect(result.pieces.entities[whiteEnPassant.takenPiece?.id || -1]).toEqual(
    expect.objectContaining({
      status: 'TAKEN'
    })
  );
  expect(result.moves.ids).toContainEqual(whiteEnPassant.id);
});

test('king side castles - action', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.json(whiteKingSideCastle));
    })
  );

  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: { row: whiteKingSideCastle.srcRow, col: whiteKingSideCastle.srcCol }
    }
  });

  await waitFor(() =>
    selectedStore.dispatch(
      clickTile({ row: whiteKingSideCastle.dstRow, col: whiteKingSideCastle.dstCol })
    )
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: { ...whiteKingSideCastle }
    })
  );
});

test('king side castles - reducer', async () => {
  const position = { row: whiteKingSideCastle.dstRow, col: whiteKingSideCastle.dstCol };
  const whiteRook = makePiece(
    'ROOK',
    'BLACK',
    whiteKingSideCastle.dstRow,
    whiteKingSideCastle.dstCol + 1
  );
  const result = reducer(
    {
      ...initialState,
      pieces: {
        ids: [whiteKingSideCastle.movingPiece.id, whiteRook.id],
        entities: {
          [whiteKingSideCastle.movingPiece.id]: { ...whiteKingSideCastle.movingPiece },
          [whiteRook.id]: whiteRook
        }
      }
    },
    clickTile.fulfilled(whiteKingSideCastle, '', position)
  );

  expect(result.selectedPosition).toBeUndefined();
  expect(result.pieces.entities[whiteKingSideCastle.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteKingSideCastle.dstRow,
      positionCol: whiteKingSideCastle.dstCol
    })
  );
  expect(result.pieces.entities[whiteRook.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteKingSideCastle.dstRow,
      positionCol: whiteKingSideCastle.dstCol - 1
    })
  );
  expect(result.moves.ids).toContainEqual(whiteKingSideCastle.id);
});

test('queen side castles - action', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.json(whiteQueenSideCastle));
    })
  );

  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: { row: whiteQueenSideCastle.srcRow, col: whiteQueenSideCastle.srcCol }
    }
  });

  await waitFor(() =>
    selectedStore.dispatch(
      clickTile({ row: whiteQueenSideCastle.dstRow, col: whiteQueenSideCastle.dstCol })
    )
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: { ...whiteQueenSideCastle }
    })
  );
});

test('queen side castles - reducer', async () => {
  const position = { row: whiteQueenSideCastle.dstRow, col: whiteQueenSideCastle.dstCol };
  const whiteRook = makePiece(
    'ROOK',
    'WHITE',
    whiteQueenSideCastle.dstRow,
    whiteQueenSideCastle.dstCol - 2
  );
  const result = reducer(
    {
      ...initialState,
      pieces: {
        ids: [whiteQueenSideCastle.movingPiece.id, whiteRook.id],
        entities: {
          [whiteQueenSideCastle.movingPiece.id]: { ...whiteQueenSideCastle.movingPiece },
          [whiteRook.id]: whiteRook
        }
      }
    },
    clickTile.fulfilled(whiteQueenSideCastle, '', position)
  );

  expect(result.selectedPosition).toBeUndefined();
  expect(result.pieces.entities[whiteQueenSideCastle.movingPiece.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteQueenSideCastle.dstRow,
      positionCol: whiteQueenSideCastle.dstCol
    })
  );
  expect(result.pieces.entities[whiteRook.id]).toEqual(
    expect.objectContaining({
      positionRow: whiteQueenSideCastle.dstRow,
      positionCol: whiteQueenSideCastle.dstCol + 1
    })
  );
  expect(result.moves.ids).toContainEqual(whiteQueenSideCastle.id);
});

test('moves a piece - invalid move', async () => {
  const message = 'invalid move message';
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(message));
    })
  );

  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: { row: whiteMove.srcRow, col: whiteMove.srcCol }
    }
  });

  await waitFor(() =>
    selectedStore.dispatch(clickTile({ row: whiteMove.dstRow, col: whiteMove.dstCol }))
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.rejected.type,
      error: expect.objectContaining({
        message
      })
    })
  );
});

test('moves a piece - network error', async () => {
  const message = 'Network Error';
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res.networkError(message);
    })
  );

  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: { row: whiteMove.srcRow, col: whiteMove.srcCol }
    }
  });

  await waitFor(() =>
    selectedStore.dispatch(clickTile({ row: whiteMove.dstRow, col: whiteMove.dstCol }))
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.rejected.type,
      error: expect.objectContaining({
        message
      })
    })
  );
});

test('tries to get pieces', async () => {
  await waitFor(() => mockedStore.dispatch(getPieces(0)));

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
  await waitFor(() => mockedStore.dispatch(getPieces(0)));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: getPieces.rejected.type
    })
  );
});

test('handles successful piece retrival', async () => {
  const result = reducer(undefined, getPieces.fulfilled([blackRook], '', 0));

  expect(result.pieces.ids).toContain(blackRook.id);
});
