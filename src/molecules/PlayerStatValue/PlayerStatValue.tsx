import React from 'react';
import { TypographyProps } from '@material-ui/core';
import DataValue from '../../atoms/DataValue/DataValue';

interface Props {
  percentage?: boolean;
  children: number;
}

const PlayerStatValue: React.FC<TypographyProps & Props> = ({ children, percentage, ...rest }) => {
  const validatedChildren = isNaN(children) || !isFinite(children) ? 0 : children;
  const alteredChildren = percentage
    ? parseFloat((validatedChildren * 100).toFixed(2))
    : validatedChildren;

  return (
    <DataValue {...rest}>
      {alteredChildren}
      {percentage && '%'}
    </DataValue>
  );
};

export default PlayerStatValue;
