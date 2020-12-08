import React from 'react';
import { useDrag } from 'react-dnd';
import Piece from '../../atoms/Piece/Piece';
import { Piece as PieceEntity } from '../../services/ChessService.types';

interface Props {
  piece: PieceEntity;
  disabled?: boolean;
}

const DraggablePiece: React.FC<Props> = ({ piece, disabled, ...rest }) => {
  const [{ isDragging }, drag] = useDrag({
    item: piece,
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: !disabled
  });

  return !isDragging ? <Piece ref={drag} type={piece.type} color={piece.color} {...rest} /> : null;
};

export default DraggablePiece;
