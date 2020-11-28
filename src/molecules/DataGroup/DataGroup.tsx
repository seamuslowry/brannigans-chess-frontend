import React from 'react';
import { Box, BoxProps } from '@material-ui/core';

const DataGroup: React.FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <Box width="100%" {...rest}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const newProps: Partial<BoxProps> = {};
        index === 0 && (newProps.mt = 0);
        index === React.Children.count(children) - 1 && (newProps.mb = 0);

        return React.cloneElement(child, newProps);
      })}
    </Box>
  );
};

export default DataGroup;
