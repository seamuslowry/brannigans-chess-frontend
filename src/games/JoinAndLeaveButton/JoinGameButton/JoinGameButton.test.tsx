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
  fullGame,
  mockEntityAdapterState,
  playerOne,
  testStore
} from '../../../utils/testData';
import JoinGameButton from './JoinGameButton';
import { joinGame } from '../../../store/games/games';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.post(`${config.serviceUrl}/players/join/1`, (req, res, ctx) => {
    return res(ctx.json<Game>(fullGame));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('joins a game as white', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <JoinGameButton gameId={1} pieceColor="WHITE" />
    </Provider>
  );

  const button = getByTestId('join-game-button');
  fireEvent.click(button);

  await waitFor(() => expect(getByTestId('join-game-button')).toBeDisabled());
  await waitFor(() => expect(getByTestId('join-game-button')).not.toBeDisabled());

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: joinGame.pending.type
    })
  );
});

test('joins a game as black', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <JoinGameButton gameId={1} pieceColor="BLACK" />
    </Provider>
  );

  const button = getByTestId('join-game-button');
  fireEvent.click(button);

  await waitFor(() => expect(getByTestId('join-game-button')).toBeDisabled());
  await waitFor(() => expect(getByTestId('join-game-button')).not.toBeDisabled());

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: joinGame.pending.type
    })
  );
});

test('will not allow to join a filled white slot', async () => {
  const mockedWithFullWhite = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 1,
      whitePlayer: playerOne
    })
  });

  const { queryByText } = render(
    <Provider store={mockedWithFullWhite}>
      <JoinGameButton gameId={1} pieceColor="WHITE" />
    </Provider>
  );

  const button = queryByText('Play');

  expect(button).not.toBeInTheDocument();
});

test('will not allow to join a filled black slot', async () => {
  const mockedWithFullWhite = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 1,
      blackPlayer: playerOne
    })
  });

  const { queryByText } = render(
    <Provider store={mockedWithFullWhite}>
      <JoinGameButton gameId={1} pieceColor="BLACK" />
    </Provider>
  );

  const button = queryByText('Play');

  expect(button).not.toBeInTheDocument();
});
