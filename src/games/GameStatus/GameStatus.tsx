import React from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { Sync, SyncProblem } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import startCase from 'lodash.startcase';
import { subscribe, unsubscribe } from '../../store/middleware/stomp/stomp';
import { AppState } from '../../store/store';
import { Message } from '../../store/socket/socket';

interface Props {
  gameId: number;
}

const GameStatus: React.FC<Props> = ({ gameId }) => {
  const topic = `/game/status/${gameId}`;
  const statusMessages = useSelector<AppState, Message[]>(state =>
    state.socket.messages.filter(m => m.topic === topic)
  );
  const connected = useSelector<AppState, boolean>(state => state.socket.connected);

  const gameStatus = !!statusMessages.length && statusMessages[statusMessages.length - 1].data;

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(subscribe(topic));

    return () => {
      dispatch(unsubscribe(topic));
    };
  }, [topic, dispatch]);

  return (
    <Paper>
      <Box width="100%" p={2}>
        <Box pb={1} display="flex" alignItems="center">
          <Typography display="inline" color="secondary">
            CONNECTION:{' '}
          </Typography>
          {connected ? (
            <Sync data-testid="sync-connected" />
          ) : (
            <SyncProblem data-testid="sync-disconnected" color="error" />
          )}
        </Box>
        <Box>
          <Typography display="inline" color="secondary">
            STATUS:{' '}
          </Typography>
          <Typography display="inline">
            {gameStatus ? startCase(gameStatus.toLowerCase()) : 'Unknown'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default GameStatus;
