import React from 'react';
import { render } from '@testing-library/react';
import Data from './Data';

test('renders', () => {
  const { container } = render(<Data />);

  expect(container.children).not.toBeNull();
});
