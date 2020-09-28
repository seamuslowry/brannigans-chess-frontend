import React from 'react';
import { render } from '@testing-library/react';
import ActiveGame from './ActiveGame';

test('renders without crashing', async () => {
  const { container } = render(<ActiveGame />);

  expect(container).toBeInTheDocument();
});
