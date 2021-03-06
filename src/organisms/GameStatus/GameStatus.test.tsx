import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import GameStatus from './GameStatus';
import { emptyGame, mockEntityAdapterState, playerOne, testStore } from '../../utils/testData';
import { AppState } from '../../store/store';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('shows the most recent status of the game when available', async () => {
  const storeWithStatusMessage = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      status: 'BLACK_TURN'
    })
  });

  const { getByText } = render(
    <Provider store={storeWithStatusMessage}>
      <GameStatus gameId={1} />
    </Provider>
  );

  const status = await waitFor(() => getByText('Black Turn'));

  expect(status).toBeInTheDocument();
});

test('shows unknown when game status is unavailable', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <GameStatus gameId={1} />
    </Provider>
  );

  const status = await waitFor(() => getByText('Unknown'));

  expect(status).toBeInTheDocument();
});

test('shows the white player when available', async () => {
  const storeWithStatusMessage = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      whitePlayer: playerOne
    })
  });

  const { getByText } = render(
    <Provider store={storeWithStatusMessage}>
      <GameStatus gameId={1} />
    </Provider>
  );

  const whitePlayer = await waitFor(() => getByText(playerOne.name));

  expect(whitePlayer).toBeInTheDocument();
});

test('shows the black player when available', async () => {
  const storeWithStatusMessage = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      blackPlayer: playerOne
    })
  });

  const { getByText } = render(
    <Provider store={storeWithStatusMessage}>
      <GameStatus gameId={1} />
    </Provider>
  );

  const blackPlayer = await waitFor(() => getByText(playerOne.name));

  expect(blackPlayer).toBeInTheDocument();
});

test('shows the connection status - disconnected', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <GameStatus gameId={1} />
    </Provider>
  );

  const connection = await waitFor(() => getByTestId('sync-disconnected'));

  expect(connection).toBeInTheDocument();
});

test('shows the connection status - connected', async () => {
  const connectedStore = mockStore({
    ...testStore,
    socket: {
      ...testStore.socket,
      connected: true
    }
  });

  const { getByTestId } = render(
    <Provider store={connectedStore}>
      <GameStatus gameId={1} />
    </Provider>
  );

  const connection = await waitFor(() => getByTestId('sync-connected'));

  expect(connection).toBeInTheDocument();
});
