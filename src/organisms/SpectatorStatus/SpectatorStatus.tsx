import React from 'react';
import { AppState, useAppDispatch } from '../../store/store';
import { useSelector } from 'react-redux';
import { getAllGameData, selectGameStatus } from '../../store/games/games';
import Data from '../../molecules/Data/Data';
import DataLabel from '../../atoms/DataLabel/DataLabel';
import DataValue from '../../atoms/DataValue/DataValue';
import { GameStatus } from '../../services/ChessService.types';
import { Paper } from '@material-ui/core';
import useGameColors from '../../utils/useGameColor';
import { unwrapResult } from '@reduxjs/toolkit';

interface Props {
  gameId: number;
}

type SpectatorState = 'LOADING...' | 'UP-TO-DATE' | 'ERROR';

const SpectatorStatus: React.FC<Props> = ({ gameId }) => {
  const [state, setState] = React.useState<SpectatorState>('LOADING...');

  const gameStatus = useSelector<AppState, GameStatus | undefined>(state =>
    selectGameStatus(state.games, gameId)
  );
  const dispatch = useAppDispatch();

  const colors = useGameColors(gameId);

  React.useEffect(() => {
    if (!gameStatus || colors.length < 2) return;

    setState('LOADING...');
    dispatch(getAllGameData(gameId))
      .then(unwrapResult)
      .then(() => setState('UP-TO-DATE'))
      .catch(() => setState('ERROR'));
  }, [colors, gameStatus, dispatch, gameId]);

  if (colors.length < 2) return null;

  return (
    <Paper>
      <Data p={2}>
        <DataLabel>SPECTATOR SYNC STATUS:</DataLabel>
        <DataValue>{state}</DataValue>
      </Data>
    </Paper>
  );
};

export default SpectatorStatus;
