import React from 'react';
import { render } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { AppState } from '@auth0/auth0-react/dist/auth0-provider';
import PlayerActionButton from './PlayerActionButton';
import {
  emptyGame,
  mockEntityAdapterState,
  playerOne,
  playerTwo,
  testStore
} from '../../utils/testData';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('allows to join a white game', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <PlayerActionButton gameId={1} color="WHITE" />
    </Provider>
  );

  const button = getByText('Play');

  expect(button).toBeInTheDocument();
});

test('allows to join a black game', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <PlayerActionButton gameId={1} color="BLACK" />
    </Provider>
  );

  const button = getByText('Play');

  expect(button).toBeInTheDocument();
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
      <PlayerActionButton gameId={1} color="WHITE" />
    </Provider>
  );

  const button = queryByText('Play');

  expect(button).not.toBeInTheDocument();
});

test('will not allow to join a filled black slot', async () => {
  const mockedWithFullBlack = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 1,
      blackPlayer: playerOne
    })
  });

  const { queryByText } = render(
    <Provider store={mockedWithFullBlack}>
      <PlayerActionButton gameId={1} color="BLACK" />
    </Provider>
  );

  const button = queryByText('Play');

  expect(button).not.toBeInTheDocument();
});

test('allows to leave a black game', async () => {
  const playerAsBlackStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      player: playerOne
    },
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 1,
      blackPlayer: playerOne
    })
  });

  const { getByText } = render(
    <Provider store={playerAsBlackStore}>
      <PlayerActionButton gameId={1} color="BLACK" />
    </Provider>
  );

  const button = getByText('Quit');

  expect(button).toBeInTheDocument();
});

test('allows to leave a white game', async () => {
  const playerAsBlackStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      player: playerOne
    },
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 1,
      whitePlayer: playerOne
    })
  });

  const { getByText } = render(
    <Provider store={playerAsBlackStore}>
      <PlayerActionButton gameId={1} color="WHITE" />
    </Provider>
  );

  const button = getByText('Quit');

  expect(button).toBeInTheDocument();
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
      <PlayerActionButton gameId={1} color="BLACK" />
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
      <PlayerActionButton gameId={1} color="WHITE" />
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
      <PlayerActionButton gameId={1} color="WHITE" />
    </Provider>
  );

  const button = queryByText('Quit');

  expect(button).not.toBeInTheDocument();
});
