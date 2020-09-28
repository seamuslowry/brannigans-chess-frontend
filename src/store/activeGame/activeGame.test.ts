import {
  reducer,
  clickTile,
  selectTile,
  setTile,
  getPieces,
  clearBoard,
  initialState
} from './activeGame';
import createMockStore from 'redux-mock-store';
import { blackRook, testStore } from '../../utils/testData';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import thunk from 'redux-thunk';
import { AppState } from '../store';
import { ActionCreator } from 'redux';
import { immutableUpdate } from '../../utils/arrayHelpers';
import config from '../../config';
import { Piece } from '../../services/ChessService';

const server = setupServer(
  rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
    return res(
      ctx.json<Piece[]>([blackRook])
    );
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

test('clears the board', () => {
  const result = reducer(undefined, clearBoard());

  expect(result).toEqual(initialState);
});

test('clicks an unselected tile', async () => {
  await mockedStore.dispatch(clickTile(0, 0));

  expect(mockedStore.getActions()).toContainEqual(selectTile(0, 0, true));
});

test('clicks a selected tile', async () => {
  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, { selected: true })
    }
  });

  await selectedStore.dispatch(clickTile(0, 0));

  expect(selectedStore.getActions()).toContainEqual(selectTile(0, 0, false));
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
});
