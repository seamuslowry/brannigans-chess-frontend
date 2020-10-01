import React from 'react';
import { Box } from '@material-ui/core';
import Tile from '../Tile/Tile';
import { useDispatch } from 'react-redux';
import { clearBoard, getPieces } from '../../store/activeGame/activeGame';
import { usePieceSize } from '../../utils/hooks';

interface Props {
  gameId: number;
}

const Board: React.FC<Props> = ({ gameId }) => {
  const array = new Array(8).fill(0);
  const dispatch = useDispatch();
  const pieceSize = usePieceSize();

  React.useEffect(() => {
    dispatch(getPieces(gameId));
    return () => {
      dispatch(clearBoard());
    };
  }, [gameId, dispatch]);

  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(8, ${pieceSize})`}
      gridTemplateRows={`repeat(8, ${pieceSize})`}
    >
      {array.map((_, row) =>
        array.map((__, col) => <Tile key={`tile-${row}-${col}`} row={row} col={col} />)
      )}
    </Box>
  );
};

export default Board;
