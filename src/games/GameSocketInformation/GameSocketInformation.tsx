import React from 'react';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import useGameSocket from '../../utils/useGameSocket';

interface Props {
  gameId: number;
}

const MAX_CONNECTION_ATTEMPTS = 5;

const GameSocketInformation: React.FC<Props> = ({ gameId }) => {
  const [socket, connectionAttempts] = useGameSocket(gameId);

  React.useEffect(() => {
    socket && socket.subscribe(`/game/status/${gameId}`, d => setGameStatus(d.body));
  }, [socket, gameId]);

  const [gameStatus, setGameStatus] = React.useState<string | null>(null);

  return (
    <Box width="100%">
      {connectionAttempts > 0 && connectionAttempts <= MAX_CONNECTION_ATTEMPTS && (
        <CircularProgress />
      )}
      {connectionAttempts > MAX_CONNECTION_ATTEMPTS && (
        <Typography color="error">
          Failed to establish connection to server. Please try again later.
        </Typography>
      )}
      {gameStatus && connectionAttempts === 0 && <Typography>{gameStatus}</Typography>}
    </Box>
  );
};

export default GameSocketInformation;
