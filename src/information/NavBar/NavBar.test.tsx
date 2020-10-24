import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppState } from '../../store/store';
import NavBar from './NavBar';
import { testStore } from '../../utils/testData';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

test('renders the insirational quote', () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    </Provider>
  );
  const quote = getByText(/never let your adversary see your pieces/i);
  expect(quote).toBeInTheDocument();
});

test('renders the login button when not logged in', () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    </Provider>
  );
  const login = getByText('Login');
  expect(login).toBeInTheDocument();
});

test('renders the logout button when logged in', () => {
  const loggedInStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      token: 'logged_in'
    }
  });
  const { getByText } = render(
    <Provider store={loggedInStore}>
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    </Provider>
  );
  const logout = getByText('Logout');
  expect(logout).toBeInTheDocument();
});
