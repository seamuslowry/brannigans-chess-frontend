import React from 'react';
import { render } from '@testing-library/react';
import DataLabel from './DataLabel';

test('renders', () => {
  const { container } = render(<DataLabel />);

  expect(container.children).not.toBeNull();
});
