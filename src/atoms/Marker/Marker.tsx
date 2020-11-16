import { Box, BoxProps, Typography } from '@material-ui/core';
import React from 'react';

const Marker: React.FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" {...rest}>
      <Typography>{children}</Typography>
    </Box>
  );
};

export default Marker;
