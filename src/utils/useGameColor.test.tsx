import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { AppState } from '../store/store';
import { playerOne, playerTwo, testStore } from './testData';
import useGameColors from './useGameColor';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('should determine that the logged in player is white', async () => {
  const mockedWhiteStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      whitePlayer: playerOne,
      blackPlayer: playerTwo
    },
    auth: {
      ...testStore.auth,
      player: playerOne
    }
  });

  const { result } = renderHook(() => useGameColors(), {
    wrapper: ({ children }) => <Provider store={mockedWhiteStore}>{children}</Provider>
  });

  expect(result.current).toEqual(['WHITE']);
});

test('should determine that the logged in player is black', async () => {
  const mockedBlackStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      whitePlayer: playerOne,
      blackPlayer: playerTwo
    },
    auth: {
      ...testStore.auth,
      player: playerTwo
    }
  });

  const { result } = renderHook(() => useGameColors(), {
    wrapper: ({ children }) => <Provider store={mockedBlackStore}>{children}</Provider>
  });

  expect(result.current).toEqual(['BLACK']);
});

test('should determine that the logged in player is not in the game', async () => {
  const mockedBlackStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame
    },
    auth: {
      ...testStore.auth,
      player: playerTwo
    }
  });

  const { result } = renderHook(() => useGameColors(), {
    wrapper: ({ children }) => <Provider store={mockedBlackStore}>{children}</Provider>
  });

  expect(result.current).toEqual([]);
});
