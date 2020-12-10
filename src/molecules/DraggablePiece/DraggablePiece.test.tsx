import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import DraggablePiece from './DraggablePiece';
import { blackRook } from '../../utils/testData';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

test('fades the piece while dragging', async () => {
  const { getByAltText } = render(
    <DndProvider backend={HTML5Backend}>
      <DraggablePiece piece={blackRook} />
    </DndProvider>
  );

  expect(getByAltText('BLACK-ROOK')).not.toHaveStyle('opacity: 0.1');

  const piece = getByAltText('BLACK-ROOK');
  fireEvent.dragStart(piece);

  expect(getByAltText('BLACK-ROOK')).toHaveStyle('opacity: 0.1');
});
