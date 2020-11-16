import React from 'react';
import { render } from '@testing-library/react';
import Profile from './Profile';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { playerOne, testStore } from '../../utils/testData';
import { AppState } from '../../store/store';
import { Provider } from 'react-redux';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore({
  ...testStore,
  auth: {
    ...testStore.auth,
    player: playerOne
  }
});

test('renders with a player', () => {
  const { container } = render(
    <Provider store={mockedStore}>
      <Profile />
    </Provider>
  );

  expect(container.firstChild).not.toBeNull();
});

test('renders nothing without a player', () => {
  const noPlayerStore = mockStore(testStore);

  const { container } = render(
    <Provider store={noPlayerStore}>
      <Profile />
    </Provider>
  );

  expect(container.firstChild).toBeNull();
});
