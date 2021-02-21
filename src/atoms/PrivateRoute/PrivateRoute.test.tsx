import React from 'react';
import { render } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import { AppState } from '../../store/store';
import {
  authenticatedAuth0,
  playerOne,
  testStore,
  unauthenticatedAuth0
} from '../../utils/testData';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');
const mockedAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());
beforeEach(() => mockedAuth0.mockImplementation(() => unauthenticatedAuth0));

test('renders nothing when not logged in', () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <PrivateRoute />
    </Provider>
  );
  const text = getByText('Not available until after login');
  expect(text).toBeInTheDocument();
});

test('renders the route when logged in', () => {
  mockedAuth0.mockImplementation(() => authenticatedAuth0);

  const loggedInStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      player: playerOne
    }
  });
  const path = '/test';
  const findText = 'Pass the test';

  const { getByText } = render(
    <Provider store={loggedInStore}>
      <MemoryRouter initialEntries={[path]}>
        <PrivateRoute path={path}>{findText}</PrivateRoute>
      </MemoryRouter>
    </Provider>
  );
  const text = getByText(findText);
  expect(text).toBeInTheDocument();
});
