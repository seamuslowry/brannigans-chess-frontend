import React from 'react';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import DraggablePiece from './DraggablePiece';
import { blackRook } from '../../utils/testData';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

test('hides the piece while dragging', async () => {
  const { getByAltText } = render(
    <DndProvider backend={HTML5Backend}>
      <DraggablePiece piece={blackRook} />
    </DndProvider>
  );

  const piece = getByAltText('BLACK-ROOK');
  fireEvent.dragStart(piece);

  await waitForElementToBeRemoved(() => getByAltText('BLACK-ROOK'));
});
