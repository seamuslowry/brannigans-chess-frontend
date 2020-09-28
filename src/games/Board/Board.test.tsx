import React from 'react';
import { render } from '@testing-library/react';
import Board from './Board';

test('renders 64 tiles', async () => {
  const { getAllByTestId } = render(<Board />);

  const tiles = getAllByTestId(/tile-/i);

  expect(tiles).toHaveLength(64);
});
