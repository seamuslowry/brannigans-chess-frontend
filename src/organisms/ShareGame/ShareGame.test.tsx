import React from 'react';
import { render } from '@testing-library/react';
import ShareGame from './ShareGame';

test('renders with a lable', async () => {
  const { getByLabelText } = render(<ShareGame gameId={1} />);

  const field = getByLabelText('Copy URL to Share');

  expect(field).toBeInTheDocument();
});
