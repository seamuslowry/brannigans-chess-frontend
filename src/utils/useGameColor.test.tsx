import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider, ProviderProps } from 'react-redux';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { AppState } from '../store/store';
import { emptyGame, mockEntityAdapterState, playerOne, playerTwo, testStore } from './testData';
import useGameColors from './useGameColor';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const wrapper: React.ComponentType<ProviderProps> = ({ store, children }) => (
  <Provider store={store}>{children}</Provider>
);

test('should determine that the logged in player is white', async () => {
  const mockedWhiteStore = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      whitePlayer: playerOne,
      blackPlayer: playerTwo
    }),
    auth: {
      ...testStore.auth,
      player: playerOne
    }
  });

  const { result } = renderHook(() => useGameColors(emptyGame.id), {
    wrapper,
    initialProps: {
      store: mockedWhiteStore
    }
  });

  expect(result.current).toEqual(['WHITE']);
});

test('should determine that the logged in player is black', async () => {
  const mockedBlackStore = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      whitePlayer: playerOne,
      blackPlayer: playerTwo
    }),
    auth: {
      ...testStore.auth,
      player: playerTwo
    }
  });

  const { result } = renderHook(() => useGameColors(emptyGame.id), {
    wrapper,
    initialProps: {
      store: mockedBlackStore
    }
  });

  expect(result.current).toEqual(['BLACK']);
});

test('should determine that the logged in player is not in the game', async () => {
  const mockedBlackStore = mockStore({
    ...testStore,
    games: mockEntityAdapterState(emptyGame),
    auth: {
      ...testStore.auth,
      player: playerTwo
    }
  });

  const { result } = renderHook(() => useGameColors(emptyGame.id), {
    wrapper,
    initialProps: {
      store: mockedBlackStore
    }
  });

  expect(result.current).toEqual(['WHITE', 'BLACK']);
});

test('should determine that the game is not loaded and suggest no colors', async () => {
  const mockedBlackStore = mockStore({
    ...testStore,
    games: mockEntityAdapterState(),
    auth: {
      ...testStore.auth,
      player: playerTwo
    }
  });

  const { result } = renderHook(() => useGameColors(emptyGame.id), {
    wrapper,
    initialProps: {
      store: mockedBlackStore
    }
  });

  expect(result.current).toEqual([]);
});

test('should not return a new array when the game status changes', async () => {
  const mockedBlackTurnStore = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      status: 'BLACK_TURN'
    }),
    auth: {
      ...testStore.auth,
      player: playerTwo
    }
  });
  const mockedWhiteTurnStore = mockStore({
    ...testStore,
    games: mockEntityAdapterState({
      ...emptyGame,
      status: 'WHITE_TURN'
    }),
    auth: {
      ...testStore.auth,
      player: playerTwo
    }
  });

  const { result, rerender } = renderHook(() => useGameColors(emptyGame.id), {
    wrapper,
    initialProps: {
      store: mockedBlackTurnStore
    }
  });

  const firstResult = result.current;

  rerender({
    store: mockedWhiteTurnStore
  });

  expect(result.current).toBe(firstResult);
});
