import React from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { Sync, SyncProblem } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import startCase from 'lodash.startcase';
import { AppState } from '../../store/store';
import useSubscription from '../../utils/useSubscription';

interface Props {
  gameId: number;
}

const GameStatus: React.FC<Props> = ({ gameId }) => {
  const topic = `/game/status/${gameId}`;
  const statusMessages = useSubscription(topic);
  const connected = useSelector<AppState, boolean>(state => state.socket.connected);

  const gameStatus = !!statusMessages.length && statusMessages[statusMessages.length - 1].data;

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
