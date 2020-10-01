import React from 'react';
import { Box, Typography, useTheme } from '@material-ui/core';
import { Move as MoveType } from '../../services/ChessService';
import Piece from '../Piece/Piece';

interface Props {
  move: MoveType;
}

const Move: React.FC<Props> = ({ move }) => {
  const theme = useTheme();
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
        <Typography>
          [{move.srcRow},{move.srcCol}] -&gt; [{move.dstRow},{move.dstCol}]
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