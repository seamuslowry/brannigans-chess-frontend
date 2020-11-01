import React from 'react';
import { Box, Paper, Typography } from '@material-ui/core';
import { Sync, SyncProblem } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import startCase from 'lodash.startcase';
import { AppState } from '../../store/store';
import useSubscription from '../../utils/useSubscription';
import { getStatusTopic } from '../../store/activeGame/activeGame';
import { GameStatus as Status, Player } from '../../services/ChessService.types';

interface Props {
  gameId: number;
}

const GameStatus: React.FC<Props> = ({ gameId }) => {
  useSubscription(getStatusTopic(gameId));

  const connected = useSelector<AppState, boolean>(state => state.socket.connected);

  const gameStatus = useSelector<AppState, Status | ''>(state => state.activeGame.status);
  const whitePlayer = useSelector<AppState, Player | null>(state => state.activeGame.whitePlayer);
  const blackPlayer = useSelector<AppState, Player | null>(state => state.activeGame.blackPlayer);

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
        <Box>
          <Typography display="inline" color="secondary">
            WHITE PLAYER:{' '}
          </Typography>
          <Typography display="inline">{whitePlayer ? whitePlayer.authId : 'OPEN'}</Typography>
        </Box>
        <Box>
          <Typography display="inline" color="secondary">
            BLACK PLAYER:{' '}
          </Typography>
          <Typography display="inline">{blackPlayer ? blackPlayer.authId : 'OPEN'}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default GameStatus;
