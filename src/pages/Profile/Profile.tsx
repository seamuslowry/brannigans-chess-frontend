import React from 'react';
import { Grid } from '@material-ui/core';
import DisplayName from '../../molecules/DisplayName/DisplayName';
import { useSelector } from 'react-redux';
import { Player } from '../../services/ChessService.types';
import { AppState } from '../../store/store';
import PlayerGames from '../../organisms/PlayerGames/PlayerGames';
import DataGroup from '../../molecules/DataGroup/DataGroup';
import DataLabel from '../../atoms/DataLabel/DataLabel';
import DataValue from '../../atoms/DataValue/DataValue';
import Data from '../../molecules/Data/Data';

const Profile: React.FC = () => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);

  if (!player) return null;

  return (
    <Grid item container xs={9} spacing={2}>
      <Grid item xs={12} md={3}>
        <DisplayName player={player} />
        <DataGroup my={3}>
          <Data>
            <DataLabel>TOTAL GAMES</DataLabel>
            <DataValue>200</DataValue>
          </Data>
          <Data>
            <DataLabel>TOTAL WINS</DataLabel>
            <DataValue>100</DataValue>
          </Data>
          <Data>
            <DataLabel>WIN PERCENTAGE</DataLabel>
            <DataValue>50%</DataValue>
          </Data>
          <Data>
            <DataLabel>TOTAL DRAWS</DataLabel>
            <DataValue>50</DataValue>
          </Data>
          <Data>
            <DataLabel>DRAW PERCENTAGE</DataLabel>
            <DataValue>50%</DataValue>
          </Data>
        </DataGroup>
        <DataGroup my={3}>
          <Data>
            <DataLabel>WHITE GAMES</DataLabel>
            <DataValue>100</DataValue>
          </Data>
          <Data>
            <DataLabel>WHITE WINS</DataLabel>
            <DataValue>50</DataValue>
          </Data>
          <Data>
            <DataLabel>WHITE WIN PERCENTAGE</DataLabel>
            <DataValue>50%</DataValue>
          </Data>
          <Data>
            <DataLabel>WHITE DRAWS</DataLabel>
            <DataValue>25</DataValue>
          </Data>
          <Data>
            <DataLabel>WHITE DRAW PERCENTAGE</DataLabel>
            <DataValue>50%</DataValue>
          </Data>
        </DataGroup>
        <DataGroup my={3}>
          <Data>
            <DataLabel>BLACK GAMES</DataLabel>
            <DataValue>100</DataValue>
          </Data>
          <Data>
            <DataLabel>BLACK WINS</DataLabel>
            <DataValue>50</DataValue>
          </Data>
          <Data>
            <DataLabel>BLACK WIN PERCENTAGE</DataLabel>
            <DataValue>50%</DataValue>
          </Data>
          <Data>
            <DataLabel>BLACK DRAWS</DataLabel>
            <DataValue>25</DataValue>
          </Data>
          <Data>
            <DataLabel>BLACK DRAW PERCENTAGE</DataLabel>
            <DataValue>50%</DataValue>
          </Data>
        </DataGroup>
      </Grid>
      <Grid item xs={12} md={9}>
        <PlayerGames player={player} />
      </Grid>
    </Grid>
  );
};

export default Profile;
