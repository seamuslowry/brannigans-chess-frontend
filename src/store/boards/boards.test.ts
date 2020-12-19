import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/dom';
import createMockStore from 'redux-mock-store';
import {
  blackMove,
  emptyGame,
  mockEntityAdapterState,
  testStore,
  whiteMove,
  whiteTake
} from '../../utils/testData';
import reducer, { dragMove } from './boards';
import { AppState } from '../store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Move } from '../../services/ChessService.types';
import config from '../../config';
import { getStatusTopic } from '../games/games';
import { STOMP_MESSAGE } from '../middleware/stomp/stomp';

const server = setupServer(
  rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
    return res(ctx.json<Move>(whiteMove));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('moves a piece - action', async () => {
  await waitFor(() =>
    mockedStore.dispatch(
      dragMove({
        piece: whiteMove.movingPiece,
        to: { row: whiteMove.dstRow, col: whiteMove.dstCol }
      })
    )
  );

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: dragMove.fulfilled.type,
      payload: { ...whiteMove }
    })
  );
});

test('moves to take a piece - action', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.json(whiteTake));
    })
  );

  await waitFor(() =>
    mockedStore.dispatch(
      dragMove({
        piece: whiteTake.movingPiece,
        to: { row: whiteTake.dstRow, col: whiteTake.dstCol }
      })
    )
  );

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: dragMove.fulfilled.type,
      payload: { ...whiteTake }
    })
  );
});

test('moves a piece - invalid move', async () => {
  const message = 'invalid move message';
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.status(400), ctx.json(message));
    })
  );

  await waitFor(() =>
    mockedStore.dispatch(
      dragMove({
        piece: whiteTake.movingPiece,
        to: { row: whiteTake.dstRow, col: whiteTake.dstCol }
      })
    )
  );

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: dragMove.rejected.type,
      error: expect.objectContaining({
        message
      })
    })
  );
});

test('moves a piece - network error', async () => {
  const message = 'Network Error';
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res.networkError(message);
    })
  );

  await waitFor(() =>
    mockedStore.dispatch(
      dragMove({
        piece: whiteTake.movingPiece,
        to: { row: whiteTake.dstRow, col: whiteTake.dstCol }
      })
    )
  );

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: dragMove.rejected.type,
      error: expect.objectContaining({
        message
      })
    })
  );
});

test('moves a piece - reducer', () => {
  const result = reducer(
    mockEntityAdapterState({ id: whiteMove.movingPiece.gameId }),
    dragMove.fulfilled(whiteMove, '', {
      piece: whiteMove.movingPiece,
      to: { row: whiteMove.dstRow, col: whiteMove.dstCol }
    })
  );

  expect(result.entities[whiteMove.movingPiece.gameId]?.move?.id).toEqual(whiteMove.id);
});

test('clears a move on status change to move color - WHITE', () => {
  const result = reducer(
    mockEntityAdapterState({ id: whiteMove.movingPiece.gameId, move: whiteMove }),
    {
      type: STOMP_MESSAGE,
      payload: {
        topic: getStatusTopic(1),
        data: JSON.stringify({
          ...emptyGame,
          id: whiteMove.movingPiece.gameId,
          status: 'WHITE_TURN'
        })
      }
    }
  );

  expect(result.entities[whiteMove.movingPiece.gameId]?.move).toBeUndefined();
});

test('does not clear a move on status change to opposite move color - WHITE', () => {
  const result = reducer(
    mockEntityAdapterState({ id: whiteMove.movingPiece.gameId, move: whiteMove }),
    {
      type: STOMP_MESSAGE,
      payload: {
        topic: getStatusTopic(1),
        data: JSON.stringify({
          ...emptyGame,
          id: whiteMove.movingPiece.gameId,
          status: 'BLACK_TURN'
        })
      }
    }
  );

  expect(result.entities[whiteMove.movingPiece.gameId]?.move).not.toBeUndefined();
});

test('clears a move on status change to move color - BLACK', () => {
  const result = reducer(
    mockEntityAdapterState({ id: blackMove.movingPiece.gameId, move: blackMove }),
    {
      type: STOMP_MESSAGE,
      payload: {
        topic: getStatusTopic(1),
        data: JSON.stringify({
          ...emptyGame,
          id: blackMove.movingPiece.gameId,
          status: 'BLACK_TURN'
        })
      }
    }
  );

  expect(result.entities[blackMove.movingPiece.gameId]?.move).toBeUndefined();
});

test('does not clear a move on status change to opposite move color - BLACK', () => {
  const result = reducer(
    mockEntityAdapterState({ id: blackMove.movingPiece.gameId, move: blackMove }),
    {
      type: STOMP_MESSAGE,
      payload: {
        topic: getStatusTopic(1),
        data: JSON.stringify({
          ...emptyGame,
          id: blackMove.movingPiece.gameId,
          status: 'WHITE_TURN'
        })
      }
    }
  );

  expect(result.entities[blackMove.movingPiece.gameId]?.move).not.toBeUndefined();
});
