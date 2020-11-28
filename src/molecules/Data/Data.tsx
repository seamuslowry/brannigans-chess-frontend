import React from 'react';
import uniqueId from 'lodash.uniqueid';
import { Box, BoxProps, TypographyProps } from '@material-ui/core';

interface Props {
  children: [JSX.Element, JSX.Element];
}

const Data: React.FC<BoxProps & Props> = ({ children, id = 'data-label', ...rest }) => {
  const labelId = React.useMemo(() => uniqueId(id), [id]);

  return (
    <Box my={1} {...rest}>
      {React.Children.map(children, (child, index) => {
        const newProps: Partial<TypographyProps> = {};
        index === 0 && (newProps.id = labelId);
        index === 1 && (newProps['aria-labelledby'] = labelId);

        return React.cloneElement(child, newProps);
      })}
    </Box>
  );
};

export default Data;
