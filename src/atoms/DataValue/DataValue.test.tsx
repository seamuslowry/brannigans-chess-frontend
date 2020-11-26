import React from 'react';
import { render } from '@testing-library/react';
import DataValue from './DataValue';

test('renders', () => {
  const { container } = render(<DataValue />);

  expect(container.children).not.toBeNull();
});
