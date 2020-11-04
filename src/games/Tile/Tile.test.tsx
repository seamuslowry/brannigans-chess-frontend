import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ActionCreator, AnyAction } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createMockStore from 'redux-mock-store';
import Tile from './Tile';
import { testStore } from '../../utils/testData';
import { clickTile } from '../../store/activeGame/activeGame.thunk';
import { AppState } from '../../store/store';
import { immutableUpdate } from '../../utils/arrayHelpers';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('clicks a tile', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile row={0} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-0-0');
  fireEvent.click(tile);

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.pending.type
    })
  );
});

test('renders selected', async () => {
  const selectedTileStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, {
        color: 'BLACK',
        type: 'PAWN',
        selected: true
      })
    }
  });

  const { getByTestId } = render(
    <Provider store={selectedTileStore}>
      <Tile row={0} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-0-0');
  // MUI default selected color
  expect(tile).toHaveStyle('background-color: rgba(0, 0, 0, 0.08)');
});

test('renders secondary color', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile row={0} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-0-0');
  // MUI default secondary color
  expect(tile).toHaveStyle('background-color: rgb(255, 64, 129)');
});

test('renders primary color', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile row={0} col={1} />
    </Provider>
  );

  const tile = getByTestId('tile-0-1');
  // MUI default primary color
  expect(tile).toHaveStyle('background-color: rgb(63, 81, 181)');
});
