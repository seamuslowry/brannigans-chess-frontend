import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/dom';
import createMockStore from 'redux-mock-store';
import { testStore, whiteMove, whiteTake } from '../../utils/testData';
import { dragMove } from './boards';
import { AppState } from '../store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Move } from '../../services/ChessService.types';
import config from '../../config';

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
