import React from 'react';
import { Typography } from '@material-ui/core';
import ChessService, { Game } from '../../services/ChessService';

const GamesList: React.FC = () => {
  const [games, setGames] = React.useState<Game[]>([]);

  React.useEffect(() => {
    ChessService.getGames(true)
      .then(({ data }) => {
        setGames(data);
      })
      .catch(e => {
        console.error('Could not load games: ', e.message);
      });
  });

  return (
    <>
      {games.map(game => (
        <Typography>{game.uuid}</Typography>
      ))}
    </>
  );
};

export default GamesList;
