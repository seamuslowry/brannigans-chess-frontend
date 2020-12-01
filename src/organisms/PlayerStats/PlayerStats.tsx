import React from 'react';
import { Player } from '../../services/ChessService.types';
import DataGroup from '../../molecules/DataGroup/DataGroup';
import DataLabel from '../../atoms/DataLabel/DataLabel';
import Data from '../../molecules/Data/Data';
import useServiceCall from '../../utils/useServiceCall';
import ChessService from '../../services/ChessService';
import PlayerStatValue from '../../molecules/PlayerStatValue/PlayerStatValue';
import { Box, CircularProgress, Typography } from '@material-ui/core';

interface Props {
  player: Player;
}

const PlayerStats: React.FC<Props> = ({ player }) => {
  const memoizedCall = React.useCallback(() => ChessService.getPlayerStats(player.id), [player.id]);
  const { loading, response, error } = useServiceCall(memoizedCall);

  const {
    whiteGames = 0,
    blackGames = 0,
    whiteWins = 0,
    blackWins = 0,
    whiteDraws = 0,
    blackDraws = 0
  } = response || {};

  return (
    <>
      {loading && (
        <Box textAlign="center" my={1}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography align="center" color="error">
          Could not load stats: {error}
        </Typography>
      )}
      {response && (
        <>
          <DataGroup my={3}>
            <Data>
              <DataLabel>TOTAL GAMES</DataLabel>
              <PlayerStatValue>{whiteGames + blackGames}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>TOTAL WINS</DataLabel>
              <PlayerStatValue>{whiteWins + blackWins}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>WIN PERCENTAGE</DataLabel>
              <PlayerStatValue percentage>
                {(whiteWins + blackWins) / (whiteGames + blackGames)}
              </PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>TOTAL DRAWS</DataLabel>
              <PlayerStatValue>{whiteDraws + blackDraws}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>DRAW PERCENTAGE</DataLabel>
              <PlayerStatValue percentage>
                {(whiteDraws + blackDraws) / (whiteGames + blackGames)}
              </PlayerStatValue>
            </Data>
          </DataGroup>
          <DataGroup my={3}>
            <Data>
              <DataLabel>WHITE GAMES</DataLabel>
              <PlayerStatValue>{whiteGames}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>WHITE WINS</DataLabel>
              <PlayerStatValue>{whiteWins}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>WHITE WIN PERCENTAGE</DataLabel>
              <PlayerStatValue percentage>{whiteWins / whiteGames}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>WHITE DRAWS</DataLabel>
              <PlayerStatValue>{whiteDraws}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>WHITE DRAW PERCENTAGE</DataLabel>
              <PlayerStatValue percentage>{whiteDraws / whiteGames}</PlayerStatValue>
            </Data>
          </DataGroup>
          <DataGroup my={3}>
            <Data>
              <DataLabel>BLACK GAMES</DataLabel>
              <PlayerStatValue>{blackGames}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>BLACK WINS</DataLabel>
              <PlayerStatValue>{blackWins}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>BLACK WIN PERCENTAGE</DataLabel>
              <PlayerStatValue percentage>{blackWins / blackGames}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>BLACK DRAWS</DataLabel>
              <PlayerStatValue>{blackDraws}</PlayerStatValue>
            </Data>
            <Data>
              <DataLabel>BLACK DRAW PERCENTAGE</DataLabel>
              <PlayerStatValue percentage>{blackDraws / blackGames}</PlayerStatValue>
            </Data>
          </DataGroup>
        </>
      )}
    </>
  );
};

export default PlayerStats;
