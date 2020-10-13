import React from 'react';
import Stomp from 'stompjs';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import useGameSubscription from '../../utils/useGameSubscription';

interface Props {
  gameId: number;
}

const GameStatus: React.FC<Props> = ({ gameId }) => {
  const [gameStatus, setGameStatus] = React.useState<string | null>(null);
  const handler = React.useCallback((d: Stomp.Message) => setGameStatus(d.body), []);
  useGameSubscription(`/game/status/${gameId}`, handler);

  return (
    <Box width="100%">
      {!gameStatus && <CircularProgress />}
      {gameStatus && <Typography>{gameStatus}</Typography>}
    </Box>
  );
};

export default GameStatus;
