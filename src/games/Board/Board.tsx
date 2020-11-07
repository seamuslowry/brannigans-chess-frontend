import React from 'react';
import { Box } from '@material-ui/core';
import Tile from '../Tile/Tile';
import { clearBoard, getPieces } from '../../store/activeGame/activeGame';
import usePieceSize from '../../utils/usePieceSize';
import PawnPromotion from '../PawnPromotion/PawnPromotion';
import { useAppDispatch } from '../../store/store';
import useGameColors from '../../utils/useGameColor';

interface Props {
  gameId: number;
}

const Board: React.FC<Props> = ({ gameId }) => {
  const array = Array.from(Array(8).keys());
  const dispatch = useAppDispatch();
  const pieceSize = usePieceSize();
  const colors = useGameColors();

  React.useEffect(() => {
    dispatch(getPieces({ gameId, colors }));
    return () => {
      dispatch(clearBoard());
    };
  }, [gameId, colors, dispatch]);

  return (
    <>
      <PawnPromotion color="WHITE" gameId={gameId} />
      <PawnPromotion color="BLACK" gameId={gameId} />
      <Box
        display="grid"
        gridTemplateColumns={`repeat(8, ${pieceSize})`}
        gridTemplateRows={`repeat(8, ${pieceSize})`}
      >
        {array.map(row =>
          array.map(col => (
            <Tile key={`tile-${gameId}-${row}-${col}`} gameId={gameId} row={row} col={col} />
          ))
        )}
      </Box>
    </>
  );
};

export default Board;
