import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import config from '../../config';

interface Props {
  gameId: number;
}

const MAX_CONNECTION_ATTEMPTS = 5;

const GameSocketInformation: React.FC<Props> = ({ gameId }) => {
  const dispatch = useDispatch();

  const [gameStatus, setGameStatus] = React.useState('');
  const [connectionAttempts, setConnectionAttempts] = React.useState(0);

  React.useEffect(() => {
    if (connectionAttempts > MAX_CONNECTION_ATTEMPTS) return () => {};

    const ws = new SockJS(`${config.serviceUrl}/ws`);
    const client = Stomp.over(ws);
    const sub = `/game/status/${gameId}`;

    client.connect(
      {},
      () => {
        client.subscribe(sub, d => setGameStatus(d.body));
        setConnectionAttempts(0);
      },
      () => {
        setTimeout(() => setConnectionAttempts(ca => ca + 1), 3000);
      }
    );
    return () => {
      client.disconnect(() => {});
    };
  }, [gameId, connectionAttempts, dispatch]);

  return (
    <Box width="100%">
      {!gameStatus && connectionAttempts <= MAX_CONNECTION_ATTEMPTS && <CircularProgress />}
      {!gameStatus && connectionAttempts > MAX_CONNECTION_ATTEMPTS && (
        <Typography color="error">
          Failed to establish connection to server. Please try again later.
        </Typography>
      )}
      <Typography>{gameStatus}</Typography>
    </Box>
  );
};

export default GameSocketInformation;
