import { reducer, clickTile, selectTile } from './activeGame';
import createMockStore from 'redux-mock-store';
import { testStore } from '../../utils/testData';
import thunk from 'redux-thunk';
import { AppState } from '../store';
import { ActionCreator } from 'redux';
import { immutableUpdate } from '../../utils/arrayHelpers';

const mockStore = createMockStore<AppState, ActionCreator<any>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('selects a tile', () => {
  const result = reducer(undefined, selectTile(0, 0, true));

  expect(result.tiles[0][0].selected).toBeTruthy();
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
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, 'selected', true)
    }
  });

  await selectedStore.dispatch(clickTile(0, 0));

  expect(selectedStore.getActions()).toContainEqual(selectTile(0, 0, false));
});
