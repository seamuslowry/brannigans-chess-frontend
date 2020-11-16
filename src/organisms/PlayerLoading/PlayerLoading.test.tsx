import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { AppState } from '../../store/store';
import PlayerLoading from './PlayerLoading';
import { authenticatedAuth0, playerOne, testStore } from '../../utils/testData';
import { useAuth0 } from '@auth0/auth0-react';
import config from '../../config';
import { Player } from '../../services/ChessService.types';
import { authenticatePlayer } from '../../store/auth/auth';

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

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

test('fully authenticates the player after auth0', async () => {
  const { queryByRole } = render(
    <Provider store={mockedStore}>
      <PlayerLoading />
    </Provider>
  );

  await waitFor(() => queryByRole('progressbar')); // shows loading indicator while loading

  await waitFor(() =>
    expect(mockedStore.getActions()).toContainEqual(
      expect.objectContaining({
        type: authenticatePlayer.fulfilled.type
      })
    )
  );

  expect(queryByRole('progressbar')).toBeNull(); // removes loading indicator when complete
});
