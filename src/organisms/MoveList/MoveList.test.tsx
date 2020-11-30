import React from 'react';
import { render } from '@testing-library/react';
import { blackMove, whiteMove } from '../../utils/testData';
import MoveList from './MoveList';

test('displays moves', async () => {
  const { getAllByText } = render(<MoveList moves={[whiteMove, blackMove]} />);

  expect(getAllByText(/->/i)).toHaveLength(2);
});

test('displays loading', async () => {
  const { getByRole } = render(<MoveList moves={[]} loading />);

  expect(getByRole('progressbar')).toBeInTheDocument();
});
