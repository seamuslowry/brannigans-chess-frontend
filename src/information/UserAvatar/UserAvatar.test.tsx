import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppState } from '../../store/store';
import UserAvatar from './UserAvatar';
import {
  authenticatedAuth0,
  playerOne,
  testStore,
  unauthenticatedAuth0
} from '../../utils/testData';
import { useAuth0 } from '@auth0/auth0-react';
import config from '../../config';
import { Player } from '../../services/ChessService.types';
import { UPDATE_PLAYER } from '../../store/auth/auth';
import { SEND_ALERT } from '../../store/notifications/notifications';

const server = setupServer(
  rest.post(`${config.serviceUrl}/players/auth`, (req, res, ctx) => {
    return res(ctx.json<Player>(playerOne));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('@auth0/auth0-react');
const mockedAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

beforeEach(() => mockedAuth0.mockImplementation(() => authenticatedAuth0));

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
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

test('retrieves an access token after authenticating', () => {
  render(
    <Provider store={mockedStore}>
      <UserAvatar />
    </Provider>
  );

  expect(authenticatedAuth0.getAccessTokenSilently).toHaveBeenCalled();
});

test('retrieves a player after getting an access token', async () => {
  const accessTokenStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      token: 'test-token'
    }
  });

  render(
    <Provider store={accessTokenStore}>
      <UserAvatar />
    </Provider>
  );

  await waitFor(() =>
    expect(accessTokenStore.getActions()).toContainEqual(
      expect.objectContaining({
        type: UPDATE_PLAYER
      })
    )
  );
});

test('fails to retrieve a player after getting an access token', async () => {
  const accessTokenStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      token: 'test-token'
    }
  });
  server.use(
    rest.post(`${config.serviceUrl}/players/auth`, (req, res, ctx) => {
      return res(ctx.status(403));
    })
  );

  render(
    <Provider store={accessTokenStore}>
      <UserAvatar />
    </Provider>
  );

  await waitFor(() =>
    expect(accessTokenStore.getActions()).toContainEqual(
      expect.objectContaining({
        type: SEND_ALERT
      })
    )
  );
});

test('renders an avatar when fully logged in', async () => {
  const accessTokenStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      token: 'test-token',
      player: playerOne
    }
  });

  const { getByAltText } = render(
    <Provider store={accessTokenStore}>
      <UserAvatar />
    </Provider>
  );

  const avatar = await waitFor(() => getByAltText(authenticatedAuth0.user.name));

  expect(avatar).toBeInTheDocument();
});
