import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import Tile from './Tile';
import { blackRook, mockEntityAdapterState, testStore } from '../../utils/testData';
import { AppState } from '../../store/store';
import { clickTile } from '../../store/boards/boards';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('clicks a tile', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile gameId={0} row={0} col={0} />
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
    boards: mockEntityAdapterState({
      id: 0,
      selectedPosition: { row: 0, col: 0 }
    })
  });

  const { getByTestId } = render(
    <Provider store={selectedTileStore}>
      <Tile gameId={0} row={0} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-0-0');
  // MUI default selected color
  expect(tile).toHaveStyle('background-color: rgba(0, 0, 0, 0.08)');
});

test('renders secondary color', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile gameId={0} row={0} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-0-0');
  // MUI default secondary color
  expect(tile).toHaveStyle('background-color: rgb(255, 64, 129)');
});

test('renders primary color', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile gameId={0} row={0} col={1} />
    </Provider>
  );

  const tile = getByTestId('tile-0-1');
  // MUI default primary color
  expect(tile).toHaveStyle('background-color: rgb(63, 81, 181)');
});

test('renders a piece', async () => {
  const withPieceStore = mockStore({
    ...testStore,
    pieces: mockEntityAdapterState(blackRook)
  });

  const { getByAltText } = render(
    <Provider store={withPieceStore}>
      <Tile gameId={0} row={0} col={0} />
    </Provider>
  );

  const tile = getByAltText('BLACK-ROOK');
  expect(tile).toBeInTheDocument();
});
