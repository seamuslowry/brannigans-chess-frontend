import React from 'react';
import { Box } from '@material-ui/core';
import DisplayName from '../../molecules/DisplayName/DisplayName';
import { useSelector } from 'react-redux';
import { Player } from '../../services/ChessService.types';
import { AppState } from '../../store/store';

const Profile: React.FC = () => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);

  if (!player) return null;

  return (
    <Box width="80%" display="flex">
      <Box width="50%">
        <DisplayName player={player} />
      </Box>
    </Box>
  );
};

export default Profile;
