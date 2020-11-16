import React from 'react';
import { render } from '@testing-library/react';
import Marker from './Marker';

test('renders', async () => {
  const { container } = render(<Marker />);

  expect(container.children).not.toBeNull();
});
