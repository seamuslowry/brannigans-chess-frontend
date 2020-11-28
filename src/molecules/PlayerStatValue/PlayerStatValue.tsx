import React from 'react';
import { TypographyProps } from '@material-ui/core';
import DataValue from '../../atoms/DataValue/DataValue';

interface Props {
  error?: boolean;
  loading?: boolean;
  percentage?: boolean;
  children: number;
}

const PlayerStatValue: React.FC<TypographyProps & Props> = ({
  children,
  error,
  loading,
  percentage,
  ...rest
}) => {
  const validatedChildren = isNaN(children) || !isFinite(children) ? 0 : children;

  return (
    <DataValue color={error ? 'error' : undefined} {...rest}>
      {loading && '...'}
      {error && '-'}
      {!loading && !error && validatedChildren}
      {!loading && !error && percentage && '%'}
    </DataValue>
  );
};

export default PlayerStatValue;
