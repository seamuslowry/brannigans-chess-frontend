import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import NavBar from './NavBar';

test('renders the insirational quote', () => {
  const { getByText } = render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );
  const quote = getByText(/never let your adversary see your pieces/i);
  expect(quote).toBeInTheDocument();
});
