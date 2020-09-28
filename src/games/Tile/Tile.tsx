import { Box, Theme, useTheme } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTile } from '../../store/activeGame/activeGame';
import { AppState } from '../../store/store';

interface Props {
  row: number;
  col: number;
}

const getBgColor = (theme: Theme, row: number, col: number, selected: boolean) => {
  if (selected) {
    return theme.palette.action.selected;
  } else if ((row + col) % 2 === 0) {
    return theme.palette.primary.main;
  } else {
    return theme.palette.secondary.light;
  }
};

const Tile: React.FC<Props> = ({ row, col }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const selected = useSelector<AppState, boolean>(
    state => state.activeGame.tiles[row][col].selected
  );

  const bgColor = getBgColor(theme, row, col, selected);

  const handleClick = () => {
    dispatch(selectTile(row, col, !selected));
  };

  return (
    <Box
      data-testid={`tile-${row}-${col}`}
      gridRow={row + 1}
      gridColumn={col + 1}
      bgcolor={bgColor}
      onClick={handleClick}
    />
  );
};

export default Tile;
