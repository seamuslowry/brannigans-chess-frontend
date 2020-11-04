import { Box, makeStyles, Theme, useTheme } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { Piece as PieceType } from '../../services/ChessService.types';
import { clickTile, makeGetActivePiece, makeGetSelected } from '../../store/activeGame/activeGame';
import { AppState, useAppDispatch } from '../../store/store';
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
  const dispatch = useAppDispatch();
  const classes = useStyles({ row, col });

  const getSelected = React.useMemo(makeGetSelected, []);
  const getActivePiece = React.useMemo(makeGetActivePiece, []);

  const selected = useSelector<AppState, boolean>(state => getSelected(state, { row, col }));
  const piece = useSelector<AppState, PieceType | undefined>(state =>
    getActivePiece(state, { row, col })
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
      <Piece type={piece?.type} color={piece?.color} />
    </Box>
  );
};

export default Tile;
