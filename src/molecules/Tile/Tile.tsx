import { Box, darken, Theme, useTheme } from '@material-ui/core';
import React from 'react';
import { useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { Piece as PieceEntity } from '../../services/ChessService.types';
import { dragMove, makeGetDestination, makeGetSource } from '../../store/boards/boards';
import { makeGetActivePiece } from '../../store/pieces/pieces';
import { AppState, useAppDispatch } from '../../store/store';
import DraggablePiece from '../DraggablePiece/DraggablePiece';

interface Props {
  gameId: number;
  row: number;
  col: number;
  disabled?: boolean;
}

const getBgColor = (
  theme: Theme,
  row: number,
  col: number,
  states: {
    hovering?: boolean;
    source?: boolean;
    destination?: boolean;
  }
) => {
  const { hovering, source, destination } = states;

  if (hovering) {
    return theme.palette.action.selected;
  } else if (source) {
    return darken(theme.palette.action.active, 0.3);
  } else if (destination) {
    return darken(theme.palette.action.active, 0.5);
  } else if ((row + col) % 2 === 0) {
    return theme.palette.secondary.light;
  } else {
    return theme.palette.primary.main;
  }
};

const Tile: React.FC<Props> = ({ row, col, gameId, disabled }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [{ isOver }, drop] = useDrop({
    accept: ['KING', 'QUEEN', 'BISHOP', 'KNIGHT', 'ROOK', 'PAWN'],
    canDrop: item => !(item.positionCol === col && item.positionRow === row),
    drop: (item: PieceEntity) =>
      dispatch(
        dragMove({
          piece: item,
          to: { row, col }
        })
      ),
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  const getActivePiece = React.useMemo(makeGetActivePiece, []);
  const getSourceTile = React.useMemo(makeGetSource, []);
  const getDestinationTile = React.useMemo(makeGetDestination, []);
  const position = React.useMemo(
    () => ({
      row,
      col
    }),
    [row, col]
  );

  const piece = useSelector<AppState, PieceEntity | undefined>(state =>
    getActivePiece(state.pieces, gameId, position)
  );
  const source = useSelector<AppState, boolean>(state =>
    getSourceTile(state.boards, gameId, position)
  );
  const destination = useSelector<AppState, boolean>(state =>
    getDestinationTile(state.boards, gameId, position)
  );

  const bgColor = getBgColor(theme, row, col, { hovering: isOver, source, destination });

  return (
    <Box
      width="100%"
      height="100%"
      data-testid={`tile-${row}-${col}`}
      bgcolor={bgColor}
      // needed until MUI v5 comes out https://github.com/mui-org/material-ui/issues/17010#issuecomment-724187064
      // @ts-ignore
      ref={drop}
    >
      {piece && <DraggablePiece piece={piece} disabled={disabled} />}
    </Box>
  );
};

export default Tile;
