import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { AppState } from '../../store/store';
import UserAvatar from './UserAvatar';
import {
  authenticatedAuth0,
  playerOne,
  testStore,
  unauthenticatedAuth0
} from '../../utils/testData';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');
const mockedAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

beforeEach(() => mockedAuth0.mockImplementation(() => authenticatedAuth0));

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

test('renders nothing when not logged in', () => {
  mockedAuth0.mockImplementation(() => unauthenticatedAuth0);
  const { container } = render(
    <Provider store={mockedStore}>
      <UserAvatar />
    </Provider>
  );
  expect(container.firstChild).toBeNull();
});

test('renders an avatar when fully logged in', async () => {
  const accessTokenStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      player: playerOne
    }
  });

  const { getByAltText } = render(
    <Provider store={accessTokenStore}>
      <UserAvatar />
    </Provider>
  );

  const avatar = await waitFor(() => getByAltText(playerOne.name));

  expect(avatar).toBeInTheDocument();
});
