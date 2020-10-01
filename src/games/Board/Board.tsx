import React from 'react';
import { Box } from '@material-ui/core';
import Tile from '../Tile/Tile';
import { useDispatch } from 'react-redux';
import { clearBoard } from '../../store/activeGame/activeGame';
import { getPieces } from '../../store/activeGame/activeGame.thunk';
import { usePieceSize } from '../../utils/hooks';

interface Props {
  gameId: number;
}

const Board: React.FC<Props> = ({ gameId }) => {
  const array = Array.from(Array(8).keys());
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
      {array.map(row => array.map(col => <Tile key={`tile-${row}-${col}`} row={row} col={col} />))}
    </Box>
  );
};

export default Board;
