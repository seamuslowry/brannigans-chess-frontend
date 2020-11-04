import React from 'react';
import { render } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { AppState } from '@auth0/auth0-react/dist/auth0-provider';
import JoinAndLeaveButton from './JoinAndLeaveButton';
import { playerOne, testStore } from '../../utils/testData';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('allows to join a white game', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <JoinAndLeaveButton gameId={1} color="WHITE" />
    </Provider>
  );

  const button = getByText('Play');

  expect(button).toBeInTheDocument();
});

test('allows to join a black game', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <JoinAndLeaveButton gameId={1} color="BLACK" />
    </Provider>
  );

  const button = getByText('Play');

  expect(button).toBeInTheDocument();
});

test('allows to leave a black game', async () => {
  const playerAsBlackStore = mockStore({
    ...testStore,
    auth: {
      ...testStore.auth,
      player: playerOne
    },
    activeGame: {
      ...testStore.activeGame,
      blackPlayer: playerOne
    }
  });

  const { getByText } = render(
    <Provider store={playerAsBlackStore}>
      <JoinAndLeaveButton gameId={1} color="BLACK" />
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
    activeGame: {
      ...testStore.activeGame,
      whitePlayer: playerOne
    }
  });

  const { getByText } = render(
    <Provider store={playerAsBlackStore}>
      <JoinAndLeaveButton gameId={1} color="WHITE" />
    </Provider>
  );

  const button = getByText('Quit');

  expect(button).toBeInTheDocument();
});
