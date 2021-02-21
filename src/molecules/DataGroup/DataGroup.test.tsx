import React from 'react';
import { render } from '@testing-library/react';
import DataGroup from './DataGroup';
import { Box } from '@material-ui/core';

test('renders with one element', () => {
  const { getByTestId } = render(
    <DataGroup>
      <Box my={1} data-testid="only-child" />
    </DataGroup>
  );

  const child = getByTestId('only-child');

  expect(child).toHaveStyle('margin-top: 0');
  expect(child).toHaveStyle('margin-bottom: 0');
});

test('renders with multiple elements', () => {
  const { getByTestId } = render(
    <DataGroup>
      <Box my={1} data-testid="first-child" />
      <Box my={1} data-testid="second-child" />
      <Box my={1} data-testid="third-child" />
    </DataGroup>
  );

  const firstChild = getByTestId('first-child');
  const secondChild = getByTestId('second-child');
  const thirdChild = getByTestId('third-child');

  expect(firstChild).toHaveStyle('margin-top: 0');
  expect(firstChild).not.toHaveStyle('margin-bottom: 0');
  expect(secondChild).not.toHaveStyle('margin-top: 0');
  expect(secondChild).not.toHaveStyle('margin-bottom: 0');
  expect(thirdChild).not.toHaveStyle('margin-top: 0');
  expect(thirdChild).toHaveStyle('margin-bottom: 0');
});

test('does not crash when passed non-elements', () => {
  const { container } = render(<DataGroup>not an element</DataGroup>);

  expect(container.children).not.toHaveLength(0);
});
