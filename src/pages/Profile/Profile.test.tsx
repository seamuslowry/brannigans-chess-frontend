import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import Profile from './Profile';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { playerOne, testStore } from '../../utils/testData';
import { AppState } from '../../store/store';
import { Provider } from 'react-redux';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import config from '../../config';

const server = setupServer(
  rest.get(`${config.serviceUrl}/players/stats/${playerOne.id}`, (req, res, ctx) => {
    return res(ctx.status(500));
  }),
  rest.get(`${config.serviceUrl}/players/games/${playerOne.id}`, (req, res, ctx) => {
    return res(ctx.status(500));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore({
  ...testStore,
  auth: {
    ...testStore.auth,
    player: playerOne
  }
});

test('renders with a player', async () => {
  const { container, getAllByRole } = render(
    <Provider store={mockedStore}>
      <Profile />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getAllByRole('progressbar')); // wait for call to complete

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
