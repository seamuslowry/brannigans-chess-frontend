import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import ClipboardTextField from './ClipboardTextField';

jest.mock('copy-to-clipboard', () => (text: string) => !!text);

test('copies the given text', async () => {
  const { getByLabelText } = render(<ClipboardTextField value="copy me" />);

  const copyButton = getByLabelText(/Copy/i);
  fireEvent.click(copyButton);

  const copiedButton = await waitFor(() => getByLabelText(/copied/i));
  expect(copiedButton).toBeDisabled();
});
