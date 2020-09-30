import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Move from './Move';
import { whiteMove } from '../../utils/testData';

test('renders a move', async () => {
  const { getByText } = render(<Move move={whiteMove} />);

  const text = await waitFor(() => getByText(/-/i));

  expect(text).toBeInTheDocument();
});
