import React from 'react';
import { Box } from '@material-ui/core';
import DisplayNameChange from '../../organisms/DisplayNameChange/DisplayNameChange';
import { useSelector } from 'react-redux';
import { Player } from '../../services/ChessService.types';
import { AppState } from '../../store/store';

const Profile: React.FC = () => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);

  if (!player) return null;

  return (
    <Box width="100%">
      <DisplayNameChange player={player} />
    </Box>
  );
};

export default Profile;
