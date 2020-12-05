import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { AppState } from '../../store/store';
import {
  allGameData,
  fullGame,
  mockEntityAdapterState,
  playerOne,
  playerThree,
  playerTwo,
  testStore
} from '../../utils/testData';
import config from '../../config';
import { AllGameData } from '../../services/ChessService.types';
import SpectatorStatus from './SpectatorStatus';

const server = setupServer(
  rest.get(`${config.serviceUrl}/games/0`, (req, res, ctx) => {
    return res(ctx.json<AllGameData>(allGameData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore({
  ...testStore,
  auth: {
    player: playerThree
  },
  games: mockEntityAdapterState({
    ...fullGame,
    id: 0,
    whitePlayer: playerOne,
    blackPlayer: playerTwo
  })
});

test('renders nothing when the player is in the game', async () => {
  const playerInGameStore = mockStore({
    ...testStore,
    auth: {
      player: playerOne
    },
    games: mockEntityAdapterState({
      ...fullGame,
      whitePlayer: playerOne
    })
  });
  const { container } = render(
    <Provider store={playerInGameStore}>
      <SpectatorStatus gameId={0} />
    </Provider>
  );

  expect(container.children).toHaveLength(0);
});

test('notifies the player the game is up-to-date', async () => {
  const { getByLabelText, getByText } = render(
    <Provider store={mockedStore}>
      <SpectatorStatus gameId={0} />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByText('LOADING...'));

  expect(getByLabelText('SPECTATOR SYNC STATUS:')).toHaveTextContent('UP-TO-DATE');
});

test('notifies the player the game is in error', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/games/0`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const { getByLabelText, getByText } = render(
    <Provider store={mockedStore}>
      <SpectatorStatus gameId={0} />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByText('LOADING...'));

  expect(getByLabelText('SPECTATOR SYNC STATUS:')).toHaveTextContent('ERROR');
});
