import { ActionCreator, AnyAction } from 'redux';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import thunk from 'redux-thunk';
import createMockStore from 'redux-mock-store';
import {
  reducer,
  selectTile,
  setTile,
  clearBoard,
  initialState,
  clearGame,
  ActiveGameState,
  clearTaken,
  takePiece,
  takePieces,
  TAKE_PIECES,
  addMove,
  addMoves,
  ADD_MOVES,
  setGameId,
  clearMoves
} from './activeGame';
import {
  blackRook,
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
import { SEND_ALERT } from '../notifications/notifications';
import { clickTile, getPieces } from './activeGame.thunk';

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

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
  const result = reducer(undefined, addMove(whiteMove));

  expect(result.moveList).toContainEqual(whiteMove);
});

test('records moves', () => {
  const result = reducer(undefined, addMoves([whiteMove]));

  expect(result.moveList).toContainEqual(whiteMove);
});

test('takes a piece', () => {
  const result = reducer(undefined, takePiece(blackRook));

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

test('clicks an unselected tile', async () => {
  const storeWithRook = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, { type: 'ROOK', color: 'BLACK' })
    }
  });

  await storeWithRook.dispatch(clickTile(0, 0));

  expect(storeWithRook.getActions()).toContainEqual(selectTile(0, 0, true));
});

test('clicks a selected tile', async () => {
  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      selectedPosition: [0, 0],
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, { selected: true })
    }
  });

  await selectedStore.dispatch(clickTile(0, 0));

  expect(selectedStore.getActions()).toContainEqual(selectTile(0, 0, false));
});

test('moves a piece', async () => {
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

  await selectedStore.dispatch(clickTile(whiteMove.dstRow, whiteMove.dstCol));

  expect(selectedStore.getActions()).toContainEqual(
    selectTile(whiteMove.srcRow, whiteMove.srcCol, false)
  );
  expect(selectedStore.getActions()).toContainEqual(
    setTile(whiteMove.srcRow, whiteMove.srcCol, undefined)
  );
  expect(selectedStore.getActions()).toContainEqual(
    setTile(whiteMove.dstRow, whiteMove.dstCol, whiteMove.movingPiece)
  );
  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: ADD_MOVES,
      payload: [whiteMove]
    })
  );
  expect(selectedStore.getActions()).not.toContainEqual(
    expect.objectContaining({
      type: TAKE_PIECES
    })
  );
});

test('moves to take a piece', async () => {
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

  await selectedStore.dispatch(clickTile(whiteTake.dstRow, whiteTake.dstCol));

  expect(selectedStore.getActions()).toContainEqual(
    selectTile(whiteTake.srcRow, whiteTake.srcCol, false)
  );
  expect(selectedStore.getActions()).toContainEqual(
    setTile(whiteTake.srcRow, whiteTake.srcCol, undefined)
  );
  expect(selectedStore.getActions()).toContainEqual(
    setTile(whiteTake.dstRow, whiteTake.dstCol, whiteTake.movingPiece)
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: ADD_MOVES,
      payload: [whiteTake]
    })
  );
  expect(selectedStore.getActions()).toContainEqual(
    whiteTake.takenPiece && takePiece(whiteTake.takenPiece)
  );
});

test('en passants a piece', async () => {
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

  await selectedStore.dispatch(clickTile(whiteEnPassant.dstRow, whiteEnPassant.dstCol));

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: ADD_MOVES,
      payload: [whiteEnPassant]
    })
  );
  expect(selectedStore.getActions()).toContainEqual(
    whiteEnPassant.takenPiece && takePiece(whiteEnPassant.takenPiece)
  );
  expect(selectedStore.getActions()).toContainEqual(
    setTile(whiteEnPassant.srcRow, whiteEnPassant.dstCol, undefined)
  );
});

test('king side castles', async () => {
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

  await selectedStore.dispatch(clickTile(whiteKingSideCastle.dstRow, whiteKingSideCastle.dstCol));

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: ADD_MOVES,
      payload: [whiteKingSideCastle]
    })
  );
  expect(selectedStore.getActions()).toContainEqual(
    setTile(whiteKingSideCastle.srcRow, whiteKingSideCastle.dstCol + 1, undefined)
  );
  expect(selectedStore.getActions()).toContainEqual(
    setTile(whiteKingSideCastle.srcRow, whiteKingSideCastle.dstCol - 1, {
      type: 'ROOK',
      color: 'WHITE'
    })
  );
});

test('queen side castles', async () => {
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

  await selectedStore.dispatch(clickTile(whiteQueenSideCastle.dstRow, whiteQueenSideCastle.dstCol));

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: ADD_MOVES,
      payload: [whiteQueenSideCastle]
    })
  );
  expect(selectedStore.getActions()).toContainEqual(
    setTile(whiteQueenSideCastle.srcRow, whiteQueenSideCastle.dstCol - 2, undefined)
  );
  expect(selectedStore.getActions()).toContainEqual(
    setTile(whiteQueenSideCastle.srcRow, whiteQueenSideCastle.dstCol + 1, {
      type: 'ROOK',
      color: 'WHITE'
    })
  );
});

test('fails to move a piece', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.status(400));
    })
  );
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

  await selectedStore.dispatch(clickTile(whiteMove.dstRow, whiteMove.dstCol));

  expect(selectedStore.getActions()).not.toContainEqual(
    selectTile(whiteMove.srcRow, whiteMove.srcCol, false)
  );
  expect(selectedStore.getActions()).not.toContainEqual(
    setTile(whiteMove.srcRow, whiteMove.srcCol, undefined)
  );
  expect(selectedStore.getActions()).not.toContainEqual(
    setTile(whiteMove.dstRow, whiteMove.dstCol, whiteMove.movingPiece)
  );
  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: SEND_ALERT
    })
  );
});

test('handles a network error when moving a piece', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res) => {
      return res.networkError('Network error');
    })
  );
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

  await selectedStore.dispatch(clickTile(whiteMove.dstRow, whiteMove.dstCol));

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: SEND_ALERT,
      payload: expect.objectContaining({
        message: expect.stringContaining('Network Error')
      })
    })
  );
});

test('gets pieces', async () => {
  await mockedStore.dispatch(getPieces(0));

  expect(mockedStore.getActions()).toContainEqual(setTile(0, 0, blackRook));
});

test('handles an error when getting pieces', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  await mockedStore.dispatch(getPieces(0));

  expect(mockedStore.getActions()).not.toContainEqual(setTile(0, 0, blackRook));
  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: SEND_ALERT
    })
  );
});
