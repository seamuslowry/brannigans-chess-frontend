import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setGameId } from '../../store/activeGame/activeGame';
import Board from '../Board/Board';

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
      dispatch(setGameId(0));
    };
  }, [gameId, dispatch]);

  return <Board gameId={gameId} />;
};

export default ActiveGame;
