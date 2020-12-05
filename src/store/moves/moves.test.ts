import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import createMockStore from 'redux-mock-store';
import config from '../../config';
import { Move } from '../../services/ChessService.types';
import {
  allGameData,
  blackMove,
  mockEntityAdapterState,
  testStore,
  whiteMove,
  whiteTake
} from '../../utils/testData';
import { clickTile } from '../boards/boards';
import { getAllGameData } from '../games/games';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';
import { AppState } from '../store';
import reducer, { addMoves, getMoves, getSharedMovesTopic, initialState } from './moves';

const server = setupServer(
  rest.get(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
    return res(
      ctx.json<Move[]>([whiteMove])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

test('records a move', () => {
  const result = reducer(undefined, addMoves([whiteMove]));

  expect(result.ids).toContainEqual(whiteMove.id);
});

test('records moves', () => {
  const result = reducer(undefined, addMoves([whiteMove]));

  expect(result.ids).toContainEqual(whiteMove.id);
});

test('sorts moves by id', () => {
  const firstMove = {
    ...whiteMove,
    id: 10
  };
  const secondMove = {
    ...blackMove,
    id: 11
  };

  const firstAdd = reducer(undefined, addMoves([secondMove]));
  const result = reducer(firstAdd, addMoves([firstMove]));

  expect(result.ids).not.toEqual([secondMove.id, firstMove.id]);
  expect(result.ids).toEqual([firstMove.id, secondMove.id]);
});

test('moves a piece', async () => {
  const request = { row: whiteMove.dstRow, col: whiteMove.dstCol, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(whiteMove, '', request));

  expect(result.ids).toContainEqual(whiteMove.id);
});

test('unrelated click request - reducer', async () => {
  const request = { row: whiteMove.dstRow, col: whiteMove.dstCol, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(true, '', request));

  expect(result).toEqual(initialState);
});

test('handles a shared move on the move topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: getSharedMovesTopic(1),
      data: JSON.stringify(whiteTake)
    }
  });

  expect(result.ids).toContain(whiteTake.id);
});

test('handles a stomp message on an unrelated topic', () => {
  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: {
      topic: 'not-a-topic',
      data: 'test'
    }
  });

  expect(result).toEqual(initialState);
});

test('tries to get moves', async () => {
  await waitFor(() => mockedStore.dispatch(getMoves({ gameId: 0, colors: ['BLACK'] })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: getMoves.fulfilled.type
    })
  );
});

test('dispatches an error when failing to get moves', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  await waitFor(() => mockedStore.dispatch(getMoves({ gameId: 0, colors: [] })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: getMoves.rejected.type
    })
  );
});

test('handles successful move retrival', async () => {
  const result = reducer(
    undefined,
    getMoves.fulfilled([whiteMove], '', { gameId: 0, colors: ['BLACK'] })
  );

  expect(result.ids).toContain(whiteMove.id);
});

test('handles successful full game data retrival', async () => {
  const result = reducer(undefined, getAllGameData.fulfilled(allGameData, '', 0));

  expect(result.ids).toEqual(allGameData.moves.map(m => m.id));
});

test('will not update existing moves on full game update', async () => {
  const mockedState = mockEntityAdapterState(...allGameData.moves);
  const newMove = { ...whiteMove, id: 101 };

  const result = reducer(
    mockedState,
    getAllGameData.fulfilled(
      {
        ...allGameData,
        moves: [...allGameData.moves, newMove]
      },
      '',
      0
    )
  );

  expect(result.entities[allGameData.moves[0].id]).toBe(
    mockedState.entities[allGameData.moves[0].id]
  );
  expect(result.entities[allGameData.moves[1].id]).toBe(
    mockedState.entities[allGameData.moves[1].id]
  );
  expect(result.ids).toContain(newMove.id);
});
