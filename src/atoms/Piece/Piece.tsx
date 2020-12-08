import React from 'react';
import { PieceColor, PieceType } from '../../services/ChessService.types';

interface Props {
  type: PieceType;
  color: PieceColor;
  height?: string;
  width?: string;
}

const Piece = React.forwardRef<HTMLImageElement, Props>(
  ({ type, color, height = '100%', width = '100%', ...rest }, ref) => {
    return (
      <img
        ref={ref}
        alt={`${color}-${type}`}
        height={height}
        width={width}
        src={`/pieces/${color}_${type}.svg`}
        {...rest}
      />
    );
  }
);

export default Piece;
