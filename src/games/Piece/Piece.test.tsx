import React from 'react';
import { render } from '@testing-library/react';
import Piece from './Piece';

test('renders with values', async () => {
  const { getByAltText } = render(<Piece color="BLACK" type="KNIGHT" />);

  const tile = getByAltText('BLACK-KNIGHT');

  expect(tile).toBeInTheDocument();
});

test('renders nothing when no values are passed', async () => {
  const { container } = render(<Piece />);

  expect(container.firstChild).toBeNull();
});
