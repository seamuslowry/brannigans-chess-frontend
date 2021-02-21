import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { AppState } from '../../store/store';
import { testStore } from '../../utils/testData';
import Login from './Login';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('renders a login button', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <Login />
    </Provider>
  );

  expect(getByText('Login')).toBeInTheDocument();
});
