import React from 'react';
import { PieceColor, PieceType } from '../../services/ChessService';

interface Props {
  type?: PieceType;
  color?: PieceColor;
  height?: string;
  width?: string;
}

const Piece: React.FC<Props> = ({ type, color, height = '100%', width = '100%' }) => {
  if (!(type && color)) return null;

  return (
    <img
      data-testid={`${color}-${type}`}
      height={height}
      width={width}
      src={`/pieces/${color}_${type}.svg`}
    />
  );
};

export default Piece;
