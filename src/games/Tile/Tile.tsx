import { Box, Theme, useTheme } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieceColor, PieceType } from '../../services/ChessService';
import { clickTile } from '../../store/activeGame/activeGame';
import { AppState } from '../../store/store';
import Piece from '../Piece/Piece';

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
      <Piece type={pieceType} color={pieceColor} />
    </Box>
  );
};

export default Tile;
