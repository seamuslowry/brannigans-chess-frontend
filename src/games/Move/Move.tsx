import React from 'react';
import { makeStyles, Typography, useTheme } from '@material-ui/core';
import { Move as MoveType } from '../../services/ChessService';
import Piece from '../Piece/Piece';

interface Props {
  move: MoveType;
}

const useStyles = makeStyles({
  center: {
    display: 'flex',
    alignItems: 'flex-end'
  }
});

const Move: React.FC<Props> = ({ move }) => {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <Typography className={classes.center}>
      <Piece
        height={`${theme.typography.fontSize * 2}rem`}
        width={`${theme.typography.fontSize * 2}rem`}
        color={move.movingPiece.color}
        type={move.movingPiece.type}
      />
      [{move.srcRow},{move.srcCol}] -&gt; [{move.dstRow},{move.dstCol}]
      {move.takenPiece && (
        <Piece
          height={`${theme.typography.fontSize * 2}rem`}
          width={`${theme.typography.fontSize * 2}rem`}
          color={move.takenPiece.color}
          type={move.takenPiece.type}
        />
      )}
    </Typography>
  );
};

export default Move;
