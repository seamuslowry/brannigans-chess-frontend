import { Box, Theme, useTheme } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { Piece as PieceEntity } from '../../services/ChessService.types';
import { clickTile, makeGetSelected } from '../../store/boards/boards';
import { makeGetActivePiece } from '../../store/pieces/pieces';
import { AppState, useAppDispatch } from '../../store/store';
import Piece from '../../atoms/Piece/Piece';

interface Props {
  gameId: number;
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

const Tile: React.FC<Props> = ({ row, col, gameId }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const getSelected = React.useMemo(makeGetSelected, []);
  const getActivePiece = React.useMemo(makeGetActivePiece, []);

  const selected = useSelector<AppState, boolean>(state =>
    getSelected(state.boards, gameId, { row, col })
  );
  const piece = useSelector<AppState, PieceEntity | undefined>(state =>
    getActivePiece(state.pieces, gameId, { row, col })
  );

  const bgColor = getBgColor(theme, row, col, selected);

  const handleClick = () => {
    dispatch(clickTile({ row, col, gameId }));
  };

  return (
    <Box
      width="100%"
      height="100%"
      data-testid={`tile-${row}-${col}`}
      bgcolor={bgColor}
      onClick={handleClick}
    >
      <Piece type={piece?.type} color={piece?.color} />
    </Box>
  );
};

export default Tile;
