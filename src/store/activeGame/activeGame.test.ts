import {
  reducer,
  clickTile,
  selectTile,
  setTile,
  getPieces,
  clearBoard,
  initialState,
  clearGame,
  ActiveGameState,
  clearTaken,
  takePiece
} from './activeGame';
import createMockStore from 'redux-mock-store';
import { blackRook, makePiece, testStore, whiteMove } from '../../utils/testData';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import thunk from 'redux-thunk';
import { AppState } from '../store';
import { ActionCreator } from 'redux';
import { immutableUpdate } from '../../utils/arrayHelpers';
import config from '../../config';
import { Move, Piece } from '../../services/ChessService';
import { SEND_ALERT } from '../notifications/notifications';

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

const mockStore = createMockStore<AppState, ActionCreator<any>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('selects a tile', () => {
  const result = reducer(undefined, selectTile(0, 0, true));

  expect(result.tiles[0][0].selected).toBeTruthy();
});

test('sets a tile', () => {
  const result = reducer(undefined, setTile(0, 0, blackRook));

  expect(result.tiles[0][0].color).toEqual(blackRook.color);
  expect(result.tiles[0][0].type).toEqual(blackRook.type);
});

test('takes a piece', () => {
  const result = reducer(undefined, takePiece(blackRook));

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
