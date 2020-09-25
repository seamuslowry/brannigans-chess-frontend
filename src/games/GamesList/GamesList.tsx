import React from 'react';
import { Typography } from '@material-ui/core';
import ChessService, { Game } from '../../services/ChessService';

const GamesList: React.FC = () => {
  const [games, setGames] = React.useState<Game[]>([]);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    ChessService.getGames(true)
      .then(({ data }) => {
        setGames(data);
      })
      .catch(e => {
        setError(`Could not load games: ${e.message}`);
      });
  }, []);

  return (
    <>
      {games.map(game => (
        <Typography key={`game-item-${game.id}`}>Game Id: {game.uuid}</Typography>
      ))}
      {error && <Typography>{error}</Typography>}
    </>
  );
};

export default GamesList;
