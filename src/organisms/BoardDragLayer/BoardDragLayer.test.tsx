import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { blackRook } from '../../utils/testData';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import BoardDragLayer from './BoardDragLayer';
import DraggablePiece from '../../molecules/DraggablePiece/DraggablePiece';

test('renders nothing when not dragging', async () => {
  const { queryByTestId } = render(
    <DndProvider backend={HTML5Backend}>
      <BoardDragLayer />
      <DraggablePiece piece={blackRook} />
    </DndProvider>
  );

  const layer = queryByTestId('board-drag-layer');

  expect(layer).toBeNull();
});

test('renders the piece when dragging', async () => {
  const { getByTestId } = render(
    <DndProvider backend={HTML5Backend}>
      <BoardDragLayer />
      <DraggablePiece data-testid="piece" piece={blackRook} />
    </DndProvider>
  );

  const piece = getByTestId('piece');
  fireEvent.dragStart(piece);

  const layer = getByTestId('board-drag-layer');

  expect(layer).toBeInTheDocument();
});
