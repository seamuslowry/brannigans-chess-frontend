import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ActionCreator, AnyAction } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createMockStore from 'redux-mock-store';
import Tile from './Tile';
import { blackRook, testStore } from '../../utils/testData';
import { clickTile } from '../../store/activeGame/activeGame';
import { AppState } from '../../store/store';

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
      selectedPosition: { row: 0, col: 0 }
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

test('renders a piece', async () => {
  const withPieceStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      pieces: {
        ids: [blackRook.id],
        entities: {
          [blackRook.id]: blackRook
        }
      }
    }
  });

  const { getByAltText } = render(
    <Provider store={withPieceStore}>
      <Tile row={0} col={0} />
    </Provider>
  );

  const tile = getByAltText('BLACK-ROOK');
  expect(tile).toBeInTheDocument();
});
