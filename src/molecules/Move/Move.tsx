import React from 'react';
import { Box, Typography, useTheme } from '@material-ui/core';
import { Move as MoveEntity, MoveType } from '../../services/ChessService.types';
import Piece from '../../atoms/Piece/Piece';
import { displayRow, displayCol } from '../../utils/markerHelper';

interface Props {
  move: MoveEntity;
}

const getMoveDescriptor = (type: MoveType) => {
  switch (type) {
    case 'EN_PASSANT':
      return 'EP';
    case 'KING_SIDE_CASTLE':
      return 'KSC';
    case 'QUEEN_SIDE_CASTLE':
      return 'QSC';
    case 'STANDARD':
    default:
      return '->';
  }
};

const getTileDescriptor = (row: number, col: number) => `${displayCol(col)}${displayRow(row)}`;

const Move: React.FC<Props> = ({ move }) => {
  const theme = useTheme();
  const ref = React.useRef<HTMLSpanElement | null>(null);

  return (
    <Box
      display="grid"
      width="100%"
      gridTemplateColumns="repeat(3, 1fr)"
      alignItems="center"
      justifyItems="center"
    >
      <Box gridColumn={1}>
        <Piece
          height={`${theme.typography.fontSize * 3}rem`}
          width={`${theme.typography.fontSize * 3}rem`}
          color={move.movingPiece.color}
          type={move.movingPiece.type}
        />
      </Box>
      <Box gridColumn={2}>
        <Typography ref={ref}>
          {getTileDescriptor(move.srcRow, move.srcCol)} {getMoveDescriptor(move.moveType)}{' '}
          {getTileDescriptor(move.dstRow, move.dstCol)}
        </Typography>
      </Box>
      <Box gridColumn={3}>
        {move.takenPiece && (
          <Piece
            height={`${theme.typography.fontSize * 3}rem`}
            width={`${theme.typography.fontSize * 3}rem`}
            color={move.takenPiece.color}
            type={move.takenPiece.type}
          />
        )}
      </Box>
    </Box>
  );
};

export default Move;
