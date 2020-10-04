import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Move from './Move';
import { whiteEnPassant, whiteMove } from '../../utils/testData';

test('renders a standard move', async () => {
  const { getByText } = render(<Move move={whiteMove} />);

  const text = await waitFor(() => getByText(/-/i));

  expect(text).toBeInTheDocument();
});

test('renders an en passant', async () => {
  const { getByText } = render(<Move move={whiteEnPassant} />);

  const text = await waitFor(() => getByText(/EP/i));

  expect(text).toBeInTheDocument();
});
