import { Box, Theme, Typography, useTheme } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieceColor, PieceType } from '../../services/ChessService';
import { clickTile } from '../../store/activeGame/activeGame';
import { AppState } from '../../store/store';

interface Props {
  row: number;
  col: number;
}

const getBgColor = (theme: Theme, row: number, col: number, selected: boolean) => {
  if (selected) {
    return theme.palette.action.selected;
  } else if ((row + col) % 2 === 0) {
    return theme.palette.secondary.light;
  } else {
    return theme.palette.primary.main;
  }
};

const getPiece = (type?: PieceType, color?: PieceColor) => {
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

const Tile: React.FC<Props> = ({ row, col }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const selected = useSelector<AppState, boolean>(
    state => state.activeGame.tiles[row][col].selected
  );
  const pieceColor = useSelector<AppState, PieceColor | undefined>(
    state => state.activeGame.tiles[row][col].color
  );
  const pieceType = useSelector<AppState, PieceType | undefined>(
    state => state.activeGame.tiles[row][col].type
  );

  const bgColor = getBgColor(theme, row, col, selected);
  const piece = getPiece(pieceType, pieceColor);

  const handleClick = () => {
    dispatch(clickTile(row, col));
  };

  return (
    <Box
      data-testid={`tile-${row}-${col}`}
      gridRow={row + 1}
      gridColumn={col + 1}
      bgcolor={bgColor}
      onClick={handleClick}
    >
      {piece}
    </Box>
  );
};

export default Tile;
