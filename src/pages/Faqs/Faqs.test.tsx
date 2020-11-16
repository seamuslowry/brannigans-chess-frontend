import React from 'react';
import { render } from '@testing-library/react';
import Faqs from './Faqs';

test('renders my favorite answer', () => {
  const { getByText } = render(<Faqs />);
  const coward = getByText('Coward.');
  expect(coward).toBeInTheDocument();
});
