import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fireEvent, render } from '@testing-library/react';
import Logout from './Logout';
import { unauthenticatedAuth0 } from '../../utils/testData';

jest.mock('@auth0/auth0-react');
const mockedAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

beforeEach(() => mockedAuth0.mockImplementation(() => unauthenticatedAuth0));

test('attempts to log out on click', () => {
  const { getByText } = render(<Logout />);
  const button = getByText('Logout');
  fireEvent.click(button);

  expect(unauthenticatedAuth0.logout).toHaveBeenCalled();
});
