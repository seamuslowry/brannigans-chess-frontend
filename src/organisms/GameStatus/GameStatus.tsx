import React from 'react';
import { Box, Paper } from '@material-ui/core';
import { Sync, SyncProblem } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import startCase from 'lodash.startcase';
import { AppState } from '../../store/store';
import useSubscription from '../../utils/useSubscription';
import { Game } from '../../services/ChessService.types';
import PlayerActionButton from '../../molecules/PlayerActionButton/PlayerActionButton';
import { getStatusTopic, selectGameById } from '../../store/games/games';
import DataLabel from '../../atoms/DataLabel/DataLabel';
import DataValue from '../../atoms/DataValue/DataValue';
import Data from '../../molecules/Data/Data';
import DataGroup from '../../molecules/DataGroup/DataGroup';
import ShareGame from '../ShareGame/ShareGame';

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
      <DataGroup p={2}>
        <Data display="flex" alignItems="center">
          <DataLabel>CONNECTION:</DataLabel>
          {connected ? (
            <Sync data-testid="sync-connected" />
          ) : (
            <SyncProblem data-testid="sync-disconnected" color="error" />
          )}
        </Data>
        <Data>
          <DataLabel>STATUS:</DataLabel>
          <DataValue>{status ? startCase(status.toLowerCase()) : 'Unknown'}</DataValue>
        </Data>
        <Data>
          <DataLabel>WHITE PLAYER:</DataLabel>
          <DataValue>
            {whitePlayer && whitePlayer.name} <PlayerActionButton gameId={gameId} color="WHITE" />
          </DataValue>
        </Data>
        <Data>
          <DataLabel>BLACK PLAYER:</DataLabel>
          <DataValue>
            {blackPlayer && blackPlayer.name} <PlayerActionButton gameId={gameId} color="BLACK" />
          </DataValue>
        </Data>
      </DataGroup>
      <Box px={2} pb={2}>
        <ShareGame gameId={gameId} />
      </Box>
    </Paper>
  );
};

export default GameStatus;
