import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Move from './Move';
import {
  whiteEnPassant,
  whiteKingSideCastle,
  whiteMove,
  whiteQueenSideCastle
} from '../../utils/testData';

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

test('renders a king side castle', async () => {
  const { getByText } = render(<Move move={whiteKingSideCastle} />);

  const text = await waitFor(() => getByText(/KSC/i));

  expect(text).toBeInTheDocument();
});

test('renders a queen side castle', async () => {
  const { getByText } = render(<Move move={whiteQueenSideCastle} />);

  const text = await waitFor(() => getByText(/QSC/i));

  expect(text).toBeInTheDocument();
});
