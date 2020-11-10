import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import Tile from '../Tile/Tile';
import usePieceSize from '../../utils/usePieceSize';
import PawnPromotion from '../PawnPromotion/PawnPromotion';
import { useAppDispatch } from '../../store/store';
import useGameColors from '../../utils/useGameColor';
import { getPieces } from '../../store/pieces/pieces';

const useStyles = makeStyles({
  borderRadius: {
    borderRadius: '0.5em',
    overflow: 'hidden'
  }
});

interface Props {
  gameId: number;
}

const Board: React.FC<Props> = ({ gameId }) => {
  const rows = {
    WHITE: Array.from(Array(8).keys()),
    BLACK: Array.from(Array(8).keys()).reverse()
  };

  const cols = Array.from(Array(8).keys());

  const dispatch = useAppDispatch();
  const pieceSize = usePieceSize();
  const colors = useGameColors(gameId);
  const classes = useStyles();

  React.useEffect(() => {
    dispatch(getPieces({ gameId, colors }));
  }, [gameId, colors, dispatch]);

  return (
    <>
      <PawnPromotion color="WHITE" gameId={gameId} />
      <PawnPromotion color="BLACK" gameId={gameId} />
      <Box
        display="grid"
        gridTemplateColumns={`repeat(8, ${pieceSize})`}
        gridTemplateRows={`repeat(8, ${pieceSize})`}
        className={classes.borderRadius}
      >
        {rows[colors[0]].map(row =>
          cols.map(col => (
            <Tile key={`tile-${gameId}-${row}-${col}`} gameId={gameId} row={row} col={col} />
          ))
        )}
      </Box>
    </>
  );
};

export default Board;
