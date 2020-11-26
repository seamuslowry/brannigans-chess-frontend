import React from 'react';
import { Box, Paper } from '@material-ui/core';
import { Sync, SyncProblem } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import startCase from 'lodash.startcase';
import { AppState } from '../../store/store';
import useSubscription from '../../utils/useSubscription';
import { Game } from '../../services/ChessService.types';
import JoinAndLeaveButton from '../../molecules/JoinAndLeaveButton/JoinAndLeaveButton';
import { getStatusTopic, selectGameById } from '../../store/games/games';
import DataLabel from '../../atoms/DataLabel/DataLabel';
import DataValue from '../../atoms/DataValue/DataValue';

interface Props {
  gameId: number;
}

const GameStatus: React.FC<Props> = ({ gameId }) => {
  useSubscription(getStatusTopic(gameId));

  const connected = useSelector<AppState, boolean>(state => state.socket.connected);

  const game = useSelector<AppState, Game | undefined>(state =>
    selectGameById(state.games, gameId)
  );

  const { status, whitePlayer, blackPlayer } = game || {};

  return (
    <Paper>
      <Box width="100%" p={2}>
        <Box display="flex" alignItems="center">
          <DataLabel>CONNECTION:</DataLabel>
          {connected ? (
            <Sync data-testid="sync-connected" />
          ) : (
            <SyncProblem data-testid="sync-disconnected" color="error" />
          )}
        </Box>
        <Box my={1}>
          <DataLabel>STATUS:</DataLabel>
          <DataValue>{status ? startCase(status.toLowerCase()) : 'Unknown'}</DataValue>
        </Box>
        <Box my={1}>
          <DataLabel>WHITE PLAYER:</DataLabel>
          <DataValue>
            {whitePlayer && whitePlayer.name} <JoinAndLeaveButton gameId={gameId} color="WHITE" />
          </DataValue>
        </Box>
        <Box>
          <DataLabel>BLACK PLAYER:</DataLabel>
          <DataValue>
            {blackPlayer && blackPlayer.name} <JoinAndLeaveButton gameId={gameId} color="BLACK" />
          </DataValue>
        </Box>
      </Box>
    </Paper>
  );
};

export default GameStatus;
