import React from 'react';
import { render } from '@testing-library/react';
import Tile from './Tile';

test('renders different colors', async () => {
  const { getByTestId } = render(
    <>
      <Tile row={0} col={0} />
      <Tile row={0} col={1} />
    </>
  );

  const red = getByTestId('tile-0-0');
  const yellow = getByTestId('tile-0-1');

  expect(red.style).not.toEqual(yellow.style); // TODO test always passes; remove when more behavior is added
});
