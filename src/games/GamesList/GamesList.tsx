import React from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import ChessService from '../../services/ChessService';
import { useServiceCall } from '../../utils/hooks';

const GamesList: React.FC = () => {
  const memoizedCall = React.useMemo(() => ChessService.getGames(true), []);
  const { loading, response: games = [], error } = useServiceCall(memoizedCall);

  return (
    <>
      {loading && <CircularProgress />}
      {games.map(game => (
        <Typography key={`game-item-${game.id}`}>Game Id: {game.uuid}</Typography>
      ))}
      {error && <Typography>Could not load games: {error}</Typography>}
    </>
  );
};

export default GamesList;
