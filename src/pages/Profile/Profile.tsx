import React from 'react';
import { Box } from '@material-ui/core';
import DisplayNameChange from '../../organisms/DisplayNameChange/DisplayNameChange';

const Profile: React.FC = () => {
  return (
    <Box width="100%">
      <DisplayNameChange />
    </Box>
  );
};

export default Profile;
