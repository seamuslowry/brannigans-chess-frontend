import { Box, useTheme } from '@material-ui/core';
import React from 'react';

interface Props {
  row: number;
  col: number;
}

const Tile: React.FC<Props> = ({ row, col }) => {
  const theme = useTheme();

  return (
    <Box
      data-testid={`tile-${row}-${col}`}
      gridRow={row + 1}
      gridColumn={col + 1}
      bgcolor={(row + col) % 2 === 0 ? theme.palette.primary.main : theme.palette.secondary.light}
    />
  );
};

export default Tile;
