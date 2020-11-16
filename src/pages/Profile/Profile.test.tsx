import React from 'react';
import { render } from '@testing-library/react';
import Profile from './Profile';

test('renders the question and the answer', () => {
  const { getByText } = render(<Profile />);

  expect(getByText('Coming Soon')).toBeInTheDocument();
});
