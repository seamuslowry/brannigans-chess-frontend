import React from 'react';
import { Box } from '@material-ui/core';
import Tile from '../Tile/Tile';
import { useDispatch } from 'react-redux';
import { clearBoard, getPieces } from '../../store/activeGame/activeGame';

interface Props {
  gameId: number;
}

const Board: React.FC<Props> = ({ gameId }) => {
  const array = new Array(8).fill(0);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getPieces(gameId));
    return () => {
      dispatch(clearBoard());
    };
  }, [gameId]);

  return (
    <Box
      width="70vh"
      height="70vh"
      display="grid"
      gridTemplateColumns="repeat(8, 1fr)"
      gridTemplateRows="repeat(8, 1fr)"
    >
      {array.map((_, row) =>
        array.map((__, col) => <Tile key={`tile-${row}-${col}`} row={row} col={col} />)
      )}
    </Box>
  );
};

export default Board;
