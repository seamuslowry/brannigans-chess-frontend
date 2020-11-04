import { ActionCreator, AnyAction } from 'redux';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import thunk from 'redux-thunk';
import createMockStore from 'redux-mock-store';
import reducer, {
  selectTile,
  setTile,
  clearBoard,
  initialState,
  clearGame,
  ActiveGameState,
  clearTaken,
  takePieces,
  addMoves,
  setGameId,
  clearMoves,
  getStatusTopic,
  getPieces
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
import { immutableUpdate } from '../../utils/arrayHelpers';
import config from '../../config';
import { Move, Piece } from '../../services/ChessService.types';
import { clickTile } from './activeGame.thunk';
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

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('sets the global game id', () => {
  const result = reducer(undefined, setGameId(1));

  expect(result.id).toEqual(1);
});

test('clears all moves', () => {
  const result = reducer(undefined, clearMoves());

  expect(result.moveList).toEqual([]);
});

test('selects a tile', () => {
  const result = reducer(undefined, selectTile(0, 0, true));

  expect(result.tiles[0][0].selected).toBeTruthy();
});

test('unselects a tile', () => {
  const result = reducer(undefined, selectTile(0, 0, false));

  expect(result.tiles[0][0].selected).toBeFalsy();
});

test('sets a tile', () => {
  const result = reducer(undefined, setTile(0, 0, blackRook));

  expect(result.tiles[0][0].color).toEqual(blackRook.color);
  expect(result.tiles[0][0].type).toEqual(blackRook.type);
});

test('records a move', () => {
  const result = reducer(undefined, addMoves([whiteMove]));

  expect(result.moveList).toContainEqual(whiteMove);
});

test('records moves', () => {
  const result = reducer(undefined, addMoves([whiteMove]));

  expect(result.moveList).toContainEqual(whiteMove);
});

test('takes a piece', () => {
  const result = reducer(undefined, takePieces([blackRook]));

  expect(result.takenPieces).toContainEqual(blackRook);
});

test('takes pieces', () => {
  const result = reducer(undefined, takePieces([blackRook]));

  expect(result.takenPieces).toContainEqual(blackRook);
});

test('clears the board', () => {
  const result = reducer(undefined, clearBoard());

  expect(result.tiles).toEqual(initialState.tiles);
  expect(result.selectedPosition).toEqual(initialState.selectedPosition);
});

test('clears the game', () => {
  const result = reducer(undefined, clearGame());

  expect(result).toEqual(initialState);
});

test('clears taken pieces', () => {
  const whiteRook = makePiece('ROOK', 'WHITE');
  const stateWithTakenPieces: ActiveGameState = {
    ...testStore.activeGame,
    takenPieces: [blackRook, whiteRook]
  };
  const result = reducer(stateWithTakenPieces, clearTaken('WHITE'));

  expect(result.takenPieces).toContainEqual(blackRook);
  expect(result.takenPieces).not.toContainEqual(whiteRook);
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

  expect(result.tiles[position.row][position.col].selected).toBe(false);
  expect(result.selectedPosition).toBeUndefined();
});

test('clicks an unselected tile - action', async () => {
  const storeWithRook = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, { type: 'ROOK', color: 'BLACK' })
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

  expect(result.tiles[position.row][position.col].selected).toBe(true);
  expect(result.selectedPosition).toEqual([position.row, position.col]);
});

test('clicks a selected tile - action', async () => {
  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: [0, 0],
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, { selected: true })
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

  expect(result.tiles[position.row][position.col].selected).toBe(false);
  expect(result.selectedPosition).toBeUndefined();
});

test('moves a piece - action', async () => {
  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: [whiteMove.srcRow, whiteMove.srcCol],
      tiles: immutableUpdate(testStore.activeGame.tiles, whiteMove.srcRow, whiteMove.srcCol, {
        type: whiteMove.movingPiece.type,
        color: whiteMove.movingPiece.color,
        selected: true
      })
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

  expect(result.tiles[whiteMove.srcRow][whiteMove.srcCol].selected).toBe(false);
  expect(result.tiles[whiteMove.srcRow][whiteMove.srcCol].type).toBeUndefined();
  expect(result.tiles[whiteMove.dstRow][whiteMove.dstCol].type).toEqual(whiteMove.movingPiece.type);
  expect(result.takenPieces).toHaveLength(0);
  expect(result.moveList).toContainEqual(whiteMove);
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
      selectedPosition: [whiteTake.srcRow, whiteTake.srcCol],
      tiles: immutableUpdate(testStore.activeGame.tiles, whiteTake.srcRow, whiteTake.srcCol, {
        type: whiteTake.movingPiece.type,
        color: whiteTake.movingPiece.color,
        selected: true
      })
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

  expect(result.tiles[whiteTake.srcRow][whiteTake.srcCol].selected).toBe(false);
  expect(result.tiles[whiteTake.srcRow][whiteTake.srcCol].type).toBeUndefined();
  expect(result.tiles[whiteTake.dstRow][whiteTake.dstCol].type).toEqual(whiteMove.movingPiece.type);
  expect(result.takenPieces).toContainEqual(whiteTake.takenPiece);
  expect(result.moveList).toContainEqual(whiteTake);
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
      selectedPosition: [whiteEnPassant.srcRow, whiteEnPassant.srcCol],
      tiles: immutableUpdate(
        testStore.activeGame.tiles,
        whiteEnPassant.srcRow,
        whiteEnPassant.srcCol,
        {
          type: whiteEnPassant.movingPiece.type,
          color: whiteEnPassant.movingPiece.color,
          selected: true
        }
      )
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

  expect(result.tiles[whiteEnPassant.srcRow][whiteEnPassant.srcCol].selected).toBe(false);
  expect(result.tiles[whiteEnPassant.srcRow][whiteEnPassant.srcCol].type).toBeUndefined();
  expect(result.tiles[whiteEnPassant.dstRow][whiteEnPassant.dstCol].type).toEqual(
    whiteEnPassant.movingPiece.type
  );
  expect(result.takenPieces).toContainEqual(whiteEnPassant.takenPiece);
  expect(result.moveList).toContainEqual(whiteEnPassant);
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
      selectedPosition: [whiteKingSideCastle.srcRow, whiteKingSideCastle.srcCol],
      tiles: immutableUpdate(
        testStore.activeGame.tiles,
        whiteKingSideCastle.srcRow,
        whiteKingSideCastle.srcCol,
        {
          type: whiteKingSideCastle.movingPiece.type,
          color: whiteKingSideCastle.movingPiece.color,
          selected: true
        }
      )
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
  const result = reducer(
    {
      ...initialState,
      tiles: immutableUpdate(
        testStore.activeGame.tiles,
        whiteKingSideCastle.dstRow,
        whiteKingSideCastle.dstCol + 1,
        { type: 'ROOK' }
      )
    },
    clickTile.fulfilled(whiteKingSideCastle, '', position)
  );

  expect(result.tiles[whiteKingSideCastle.srcRow][whiteKingSideCastle.srcCol].selected).toBe(false);
  expect(result.tiles[whiteKingSideCastle.srcRow][whiteKingSideCastle.srcCol].type).toBeUndefined();
  expect(result.tiles[whiteKingSideCastle.dstRow][whiteKingSideCastle.dstCol].type).toEqual(
    whiteKingSideCastle.movingPiece.type
  );
  expect(result.tiles[whiteKingSideCastle.dstRow][whiteKingSideCastle.dstCol - 1].type).toEqual(
    'ROOK'
  );
  expect(result.takenPieces).toHaveLength(0);
  expect(result.moveList).toContainEqual(whiteKingSideCastle);
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
      selectedPosition: [whiteQueenSideCastle.srcRow, whiteQueenSideCastle.srcCol],
      tiles: immutableUpdate(
        testStore.activeGame.tiles,
        whiteQueenSideCastle.srcRow,
        whiteQueenSideCastle.srcCol,
        {
          type: whiteQueenSideCastle.movingPiece.type,
          color: whiteQueenSideCastle.movingPiece.color,
          selected: true
        }
      )
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
  const result = reducer(
    {
      ...initialState,
      tiles: immutableUpdate(
        testStore.activeGame.tiles,
        whiteQueenSideCastle.dstRow,
        whiteQueenSideCastle.dstCol - 2,
        { type: 'ROOK' }
      )
    },
    clickTile.fulfilled(whiteQueenSideCastle, '', position)
  );

  expect(result.tiles[whiteQueenSideCastle.srcRow][whiteQueenSideCastle.srcCol].selected).toBe(
    false
  );
  expect(
    result.tiles[whiteQueenSideCastle.srcRow][whiteQueenSideCastle.srcCol].type
  ).toBeUndefined();
  expect(result.tiles[whiteQueenSideCastle.dstRow][whiteQueenSideCastle.dstCol].type).toEqual(
    whiteQueenSideCastle.movingPiece.type
  );
  expect(result.tiles[whiteQueenSideCastle.dstRow][whiteQueenSideCastle.dstCol + 1].type).toEqual(
    'ROOK'
  );
  expect(result.takenPieces).toHaveLength(0);
  expect(result.moveList).toContainEqual(whiteQueenSideCastle);
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
      selectedPosition: [whiteMove.srcRow, whiteMove.srcCol]
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
      selectedPosition: [whiteMove.srcRow, whiteMove.srcCol]
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

  expect(result.tiles[blackRook.positionRow][blackRook.positionCol]).toEqual(
    expect.objectContaining({
      color: blackRook.color,
      type: blackRook.type
    })
  );
});
