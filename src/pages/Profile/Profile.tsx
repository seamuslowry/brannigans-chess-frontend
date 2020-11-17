import React from 'react';
import { Grid } from '@material-ui/core';
import DisplayName from '../../molecules/DisplayName/DisplayName';
import { useSelector } from 'react-redux';
import { Player } from '../../services/ChessService.types';
import { AppState } from '../../store/store';

const Profile: React.FC = () => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);

  if (!player) return null;

  return (
    <Grid item container xs={9}>
      <Grid item xs={12} lg={4}>
        <DisplayName player={player} />
      </Grid>
    </Grid>
  );
};

export default Profile;
