import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { AppState } from '@auth0/auth0-react/dist/auth0-provider';
import { Game } from '../../../services/ChessService.types';
import config from '../../../config';
import {
  emptyGame,
  mockEntityAdapterState,
  playerOne,
  playerTwo,
  testStore
} from '../../../utils/testData';
import LeaveGameButton from './LeaveGameButton';
import { leaveGame } from '../../../store/games/games';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.post(`${config.serviceUrl}/players/leave/1`, (req, res, ctx) => {
    return res(ctx.json<Game>(emptyGame));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('leaves a white game', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <LeaveGameButton gameId={1} pieceColor="WHITE" />
    </Provider>
  );

  const button = getByTestId('leave-game-button');
  fireEvent.click(button);

  await waitFor(() => expect(getByTestId('leave-game-button')).toBeDisabled());

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: leaveGame.pending.type
    })
  );
});

test('leaves a black game', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <LeaveGameButton gameId={1} pieceColor="BLACK" />
    </Provider>
  );

  const button = getByTestId('leave-game-button');
  fireEvent.click(button);

  await waitFor(() => expect(getByTestId('leave-game-button')).toBeDisabled());

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: leaveGame.pending.type
    })
  );
});

test('will not allow to leave black when not self', async () => {
  const playerNotBlackStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      player: playerTwo
    },
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 1,
      blackPlayer: playerOne
    })
  });

  const { queryByText } = render(
    <Provider store={playerNotBlackStore}>
      <LeaveGameButton gameId={1} pieceColor="BLACK" />
    </Provider>
  );

  const button = queryByText('Quit');

  expect(button).not.toBeInTheDocument();
});

test('will not allow to leave white when not self', async () => {
  const playerNotBlackStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      player: playerTwo
    },
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 1,
      whitePlayer: playerOne
    })
  });

  const { queryByText } = render(
    <Provider store={playerNotBlackStore}>
      <LeaveGameButton gameId={1} pieceColor="WHITE" />
    </Provider>
  );

  const button = queryByText('Quit');

  expect(button).not.toBeInTheDocument();
});

test('will not allow to leave a full game', async () => {
  const playerNotBlackStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      player: playerTwo
    },
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 1,
      blackPlayer: playerOne,
      whitePlayer: playerTwo
    })
  });

  const { queryByText } = render(
    <Provider store={playerNotBlackStore}>
      <LeaveGameButton gameId={1} pieceColor="WHITE" />
    </Provider>
  );

  const button = queryByText('Quit');

  expect(button).not.toBeInTheDocument();
});
