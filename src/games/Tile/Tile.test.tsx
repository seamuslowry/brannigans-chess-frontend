import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Tile from './Tile';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { testStore } from '../../utils/testData';
import { SELECT_TILE } from '../../store/activeGame/activeGame';
import { ActionCreator } from 'redux';
import thunk from 'redux-thunk';
import { AppState } from '../../store/store';
import { immutableUpdate } from '../../utils/arrayHelpers';

const mockStore = createMockStore<AppState, ActionCreator<any>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('does nothing when clicking empty', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile row={0} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-0-0');
  fireEvent.click(tile);

  expect(mockedStore.getActions()).toHaveLength(0);
});

test('selects when clicking piece', async () => {
  const storeWithPiece = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 1, 0, {
        type: 'PAWN',
        color: 'BLACK',
        selected: true
      })
    }
  });
  const { getByTestId } = render(
    <Provider store={storeWithPiece}>
      <Tile row={1} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-1-0');
  fireEvent.click(tile);

  expect(storeWithPiece.getActions()).toContainEqual(
    expect.objectContaining({
      type: SELECT_TILE
    })
  );
});