import { Typography } from '@material-ui/core';
import React from 'react';
import { PieceColor, PieceType } from '../../services/ChessService';

interface Props {
  type?: PieceType;
  color?: PieceColor;
}

const Piece: React.FC<Props> = ({ type, color }) => {
  if (!(type && color)) return null;

  let letter;
  switch (type) {
    case 'BISHOP':
      letter = 'B';
      break;
    case 'PAWN':
      letter = 'P';
      break;
    case 'QUEEN':
      letter = 'Q';
      break;
    case 'KING':
      letter = 'K';
      break;
    case 'KNIGHT':
      letter = 'H';
      break;
    case 'ROOK':
      letter = 'R';
      break;
  }

  return (
    <Typography align="center" color={color === 'WHITE' ? 'textPrimary' : 'error'}>
      {letter}
    </Typography>
  );
};

export default Piece;
