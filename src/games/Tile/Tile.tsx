import { Box, makeStyles, Theme, useTheme } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PieceColor, PieceType } from '../../services/ChessService.types';
import { clickTile } from '../../store/activeGame/activeGame.thunk';
import { AppState } from '../../store/store';
import Piece from '../Piece/Piece';

interface Props {
  row: number;
  col: number;
}

const BORDER_RADIUS = '.5rem';

const useStyles = makeStyles<Theme, Props>({
  borderRadius: {
    borderTopRightRadius: props => (props.col === 7 && props.row === 0 ? BORDER_RADIUS : undefined),
    borderTopLeftRadius: props => (props.col === 0 && props.row === 0 ? BORDER_RADIUS : undefined),
    borderBottomRightRadius: props =>
      props.col === 7 && props.row === 7 ? BORDER_RADIUS : undefined,
    borderBottomLeftRadius: props =>
      props.col === 0 && props.row === 7 ? BORDER_RADIUS : undefined
  }
});

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
  const classes = useStyles({ row, col });

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
    dispatch(clickTile({ row, col }));
  };

  return (
    <Box
      data-testid={`tile-${row}-${col}`}
      gridRow={row + 1}
      gridColumn={col + 1}
      bgcolor={bgColor}
      onClick={handleClick}
      className={classes.borderRadius}
    >
      <Piece type={pieceType} color={pieceColor} />
    </Box>
  );
};

export default Tile;
