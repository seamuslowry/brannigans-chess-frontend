import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { testStore } from '../../utils/testData';
import AuthenticationDialog from './AuthenticationDialog';

const mockStore = createMockStore([thunk]);
const mockedStore = mockStore(testStore);

test('opens as signup', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <AuthenticationDialog variant="signup" open onClose={jest.fn()} />
    </Provider>
  );

  expect(getByText('Signup')).toBeInTheDocument();
});

test('opens as login', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <AuthenticationDialog variant="login" open onClose={jest.fn()} />
    </Provider>
  );

  expect(getByText('Login')).toBeInTheDocument();
});
