import { Box } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { clearGame, setGameId } from '../../store/activeGame/activeGame';
import Board from '../Board/Board';
import TakenPieces from '../TakenPieces/TakenPieces';

interface ExpectedRouteParams {
  id?: string;
}

const ActiveGame: React.FC = () => {
  let { id } = useParams<ExpectedRouteParams>();
  const dispatch = useDispatch();

  const gameId = Number(id);

  React.useEffect(() => {
    dispatch(setGameId(gameId));

    return () => {
      dispatch(clearGame());
    };
  }, [gameId, dispatch]);

  return (
    <Box display="grid" gridTemplateColumns="1fr min-content 1fr">
      <Box gridRow={1} gridColumn={1}>
        <TakenPieces gameId={gameId} color="WHITE" />
      </Box>
      <Box gridRow={1} gridColumn={2}>
        <Board gameId={gameId} />
      </Box>
      <Box gridRow={1} gridColumn={3}>
        <TakenPieces gameId={gameId} color="BLACK" />
      </Box>
    </Box>
  );
};

export default ActiveGame;
