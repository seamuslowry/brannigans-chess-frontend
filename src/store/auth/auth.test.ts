import reducer, { authenticatePlayer, clearAuth, initialState } from './auth';
import { playerOne, testStore } from '../../utils/testData';
import { waitFor } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import createMockStore from 'redux-mock-store';
import { Player } from '../../services/ChessService.types';
import config from '../../config';
import { AppState } from '../store';

jest.mock('jwt-decode', () => jest.fn().mockReturnValue({ exp: Date.now() + 60 * 60 }));

const server = setupServer(
  rest.post(`${config.serviceUrl}/players/auth`, (req, res, ctx) => {
    return res(ctx.json<Player>(playerOne));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

test('tries to get the player', async () => {
  await waitFor(() =>
    mockedStore.dispatch(
      authenticatePlayer({
        getAccessToken: jest.fn().mockResolvedValue('test'),
        playerInfo: {
          name: 'test',
          imageUrl: 'image'
        }
      })
    )
  );

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: authenticatePlayer.fulfilled.type
    })
  );
});

test('dispatches an error when failing to get the player', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/players/auth`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  await waitFor(() =>
    mockedStore.dispatch(
      authenticatePlayer({
        getAccessToken: jest.fn().mockResolvedValue('test'),
        playerInfo: {
          name: 'test',
          imageUrl: 'image'
        }
      })
    )
  );

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: authenticatePlayer.rejected.type
    })
  );
});

test('handles successful player authentication', async () => {
  const result = reducer(
    undefined,
    authenticatePlayer.fulfilled(playerOne, '', {
      getAccessToken: jest.fn().mockResolvedValue('test'),
      playerInfo: {
        name: 'test',
        imageUrl: 'image'
      }
    })
  );

  expect(result.player).toEqual(playerOne);
});

test('handles rejected player authentication', async () => {
  const result = reducer(
    {
      player: playerOne
    },
    authenticatePlayer.rejected(new Error(), '', {
      getAccessToken: jest.fn().mockResolvedValue('test'),
      playerInfo: {
        name: 'test',
        imageUrl: 'image'
      }
    })
  );

  expect(result).toEqual(initialState);
});

test('clears authentication', async () => {
  const result = reducer(
    {
      player: playerOne
    },
    clearAuth()
  );

  expect(result).toEqual(initialState);
});
