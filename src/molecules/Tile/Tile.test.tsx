import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import Tile from './Tile';
import { blackRook, makePiece, mockEntityAdapterState, testStore } from '../../utils/testData';
import { AppState } from '../../store/store';
import { dragMove } from '../../store/boards/boards';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggablePiece from '../DraggablePiece/DraggablePiece';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('handles a piece drop', async () => {
  const withPieceStore = mockStore({
    ...testStore,
    pieces: mockEntityAdapterState(blackRook)
  });

  const { getByTestId } = render(
    <DndProvider backend={HTML5Backend}>
      <Provider store={withPieceStore}>
        <Tile gameId={0} row={0} col={0} />
      </Provider>
    </DndProvider>
  );

  const tile = getByTestId('tile-0-0');
  const draggablePiece = tile.firstChild;

  expect(draggablePiece).not.toBeNull();

  draggablePiece && fireEvent.dragStart(draggablePiece);
  fireEvent.drop(tile);

  expect(withPieceStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: dragMove.pending.type
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
    <DndProvider backend={HTML5Backend}>
      <Provider store={selectedTileStore}>
        <Tile gameId={0} row={0} col={0} />
        <DraggablePiece data-testid="draggable-piece" piece={makePiece('ROOK', 'WHITE')} />
      </Provider>
    </DndProvider>
  );

  const tile = getByTestId('tile-0-0');
  const draggablePiece = getByTestId('draggable-piece');
  fireEvent.dragStart(draggablePiece);
  fireEvent.dragOver(tile);

  // MUI default selected color
  expect(tile).toHaveStyle('background-color: rgba(0, 0, 0, 0.08)');
});

test('renders secondary color', async () => {
  const { getByTestId } = render(
    <DndProvider backend={HTML5Backend}>
      <Provider store={mockedStore}>
        <Tile gameId={0} row={0} col={0} />
      </Provider>
    </DndProvider>
  );

  const tile = getByTestId('tile-0-0');
  // MUI default secondary color
  expect(tile).toHaveStyle('background-color: rgb(255, 64, 129)');
});

test('renders primary color', async () => {
  const { getByTestId } = render(
    <DndProvider backend={HTML5Backend}>
      <Provider store={mockedStore}>
        <Tile gameId={0} row={0} col={1} />
      </Provider>
    </DndProvider>
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
    <DndProvider backend={HTML5Backend}>
      <Provider store={withPieceStore}>
        <Tile gameId={0} row={0} col={0} />
      </Provider>
    </DndProvider>
  );

  const tile = getByAltText('BLACK-ROOK');
  expect(tile).toBeInTheDocument();
});
