import React from 'react';
import { Grid } from '@material-ui/core';
import DisplayName from '../../molecules/DisplayName/DisplayName';
import { useSelector } from 'react-redux';
import { Player } from '../../services/ChessService.types';
import { AppState } from '../../store/store';
import PlayerGames from '../../organisms/PlayerGames/PlayerGames';

const Profile: React.FC = () => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);

  if (!player) return null;

  return (
    <Grid item container xs={9} spacing={2}>
      <Grid item xs={12} md={4}>
        <DisplayName player={player} />
      </Grid>
      <Grid item xs={12} md={8}>
        <PlayerGames player={player} />
      </Grid>
    </Grid>
  );
};

export default Profile;
