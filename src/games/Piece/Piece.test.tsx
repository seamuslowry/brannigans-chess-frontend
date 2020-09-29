import React from 'react';
import { render } from '@testing-library/react';
import Piece from './Piece';

test('renders a black knight', async () => {
  const { getByText } = render(<Piece color="BLACK" type="KNIGHT" />);

  const tile = getByText('H');

  expect(tile).toBeInTheDocument();
});

test('renders a black bishop', async () => {
  const { getByText } = render(<Piece color="BLACK" type="BISHOP" />);

  const tile = getByText('B');

  expect(tile).toBeInTheDocument();
});

test('renders a black queen', async () => {
  const { getByText } = render(<Piece color="BLACK" type="QUEEN" />);

  const tile = getByText('Q');

  expect(tile).toBeInTheDocument();
});

test('renders a black king', async () => {
  const { getByText } = render(<Piece color="BLACK" type="KING" />);

  const tile = getByText('K');

  expect(tile).toBeInTheDocument();
});

test('renders a black pawn', async () => {
  const { getByText } = render(<Piece color="BLACK" type="PAWN" />);

  const tile = getByText('P');

  expect(tile).toBeInTheDocument();
});

test('renders a black rook', async () => {
  const { getByText } = render(<Piece color="BLACK" type="ROOK" />);

  const tile = getByText('R');

  expect(tile).toBeInTheDocument();
});

test('renders a white pawn', async () => {
  const { getByText } = render(<Piece color="WHITE" type="PAWN" />);

  const tile = getByText('P');

  expect(tile).toBeInTheDocument();
});
