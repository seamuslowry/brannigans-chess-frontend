import React from 'react';
import { Box, BoxProps } from '@material-ui/core';

const Data: React.FC<BoxProps> = props => {
  return <Box my={1} {...props} />;
};

export default Data;
