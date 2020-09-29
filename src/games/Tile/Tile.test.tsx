import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Tile from './Tile';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { makePiece, testStore } from '../../utils/testData';
import { SELECT_TILE } from '../../store/activeGame/activeGame';
import { ActionCreator } from 'redux';
import thunk from 'redux-thunk';
import { AppState } from '../../store/store';
import { immutableUpdate } from '../../utils/arrayHelpers';

const mockStore = createMockStore<AppState, ActionCreator<any>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('selects on click', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile row={0} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-0-0');
  fireEvent.click(tile);

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: SELECT_TILE
    })
  );
});

test('renders a black knight', async () => {
  const pieceStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 1, makePiece('KNIGHT', 'BLACK'))
    }
  });

  const { getByText } = render(
    <Provider store={pieceStore}>
      <Tile row={0} col={1} />
    </Provider>
  );

  const tile = getByText('H');

  expect(tile).toBeInTheDocument();
});

test('renders a black bishop', async () => {
  const pieceStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 2, makePiece('BISHOP', 'BLACK'))
    }
  });

  const { getByText } = render(
    <Provider store={pieceStore}>
      <Tile row={0} col={2} />
    </Provider>
  );

  const tile = getByText('B');

  expect(tile).toBeInTheDocument();
});

test('renders a black queen', async () => {
  const pieceStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 3, makePiece('QUEEN', 'BLACK'))
    }
  });

  const { getByText } = render(
    <Provider store={pieceStore}>
      <Tile row={0} col={3} />
    </Provider>
  );

  const tile = getByText('Q');

  expect(tile).toBeInTheDocument();
});

test('renders a black king', async () => {
  const pieceStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 4, makePiece('KING', 'BLACK'))
    }
  });

  const { getByText } = render(
    <Provider store={pieceStore}>
      <Tile row={0} col={4} />
    </Provider>
  );

  const tile = getByText('K');

  expect(tile).toBeInTheDocument();
});

test('renders a black pawn', async () => {
  const pieceStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore,
      tiles: immutableUpdate(testStore.activeGame.tiles, 1, 0, makePiece('PAWN', 'BLACK'))
    }
  });

  const { getByText } = render(
    <Provider store={pieceStore}>
      <Tile row={1} col={0} />
    </Provider>
  );

  const tile = getByText('P');

  expect(tile).toBeInTheDocument();
});

test('renders a black rook', async () => {
  const pieceStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, makePiece('ROOK', 'BLACK'))
    }
  });

  const { getByText } = render(
    <Provider store={pieceStore}>
      <Tile row={0} col={0} />
    </Provider>
  );

  const tile = getByText('R');

  expect(tile).toBeInTheDocument();
});

test('renders a white pawn', async () => {
  const pieceStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore,
      tiles: immutableUpdate(testStore.activeGame.tiles, 6, 0, makePiece('PAWN', 'WHITE'))
    }
  });

  const { getByText } = render(
    <Provider store={pieceStore}>
      <Tile row={6} col={0} />
    </Provider>
  );

  const tile = getByText('P');

  expect(tile).toBeInTheDocument();
});
