import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import React from 'react';
import CreateGameButton from './CreateGameButton';

test('renders a button', async () => {
  const { getByText } = render(<CreateGameButton />);

  const button = await waitFor(() => getByText('Create Game'));

  expect(button).toBeInTheDocument();
});
