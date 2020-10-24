import React from 'react';
import { render } from '@testing-library/react';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import PrivateRoute from './PrivateRoute';
import { AppState } from '../../store/store';
import { testStore } from '../../utils/testData';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

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
  const loggedInStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      token: 'logged_is'
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
