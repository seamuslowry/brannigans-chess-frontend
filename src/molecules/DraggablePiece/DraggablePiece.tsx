import React from 'react';
import { useDrag } from 'react-dnd';
import Piece from '../../atoms/Piece/Piece';
import { Piece as PieceEntity } from '../../services/ChessService.types';

interface Props {
  piece: PieceEntity;
}

const DraggablePiece: React.FC<Props> = ({ piece }) => {
  const [{ isDragging }, drag] = useDrag({
    item: piece,
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return !isDragging ? <Piece ref={drag} type={piece.type} color={piece.color} /> : null;
};

export default DraggablePiece;
