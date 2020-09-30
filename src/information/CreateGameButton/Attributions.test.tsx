import React from 'react';
import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import Attributions from './Attributions';

test('renders text', async () => {
  const { getByText } = render(<Attributions />);

  const attribution = await waitFor(() => getByText(/vector image/i));

  expect(attribution).toBeInTheDocument();
});
