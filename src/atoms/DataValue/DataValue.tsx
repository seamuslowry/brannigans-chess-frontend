import React from 'react';
import { Typography, TypographyProps } from '@material-ui/core';

const DataValue: React.FC<TypographyProps> = props => {
  return <Typography display="inline" {...props} />;
};

export default DataValue;
