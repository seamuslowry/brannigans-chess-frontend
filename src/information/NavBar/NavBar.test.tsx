import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { AppState } from '../../store/store';
import NavBar from './NavBar';
import {
  playerOne,
  testStore,
  unauthenticatedAuth0,
  authenticatedAuth0
} from '../../utils/testData';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');
const mockedAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

beforeEach(() => mockedAuth0.mockImplementation(() => unauthenticatedAuth0));

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
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
  mockedAuth0.mockImplementation(() => authenticatedAuth0);
  const loggedInStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      player: playerOne
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
