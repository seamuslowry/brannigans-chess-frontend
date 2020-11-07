import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/dom';
import createMockStore from 'redux-mock-store';
import {
  testStore,
  makePiece,
  mockEntityAdapterState,
  whiteMove,
  whiteTake,
  whiteEnPassant,
  whiteKingSideCastle,
  whiteQueenSideCastle
} from '../../utils/testData';
import reducer, { clickTile } from './boards';
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

test('clicks an unselectable tile - action', async () => {
  await waitFor(() => mockedStore.dispatch(clickTile({ row: 0, col: 0, gameId: 0 })));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: null
    })
  );
});

test('clicks an unselectable tile - reducer', async () => {
  const request = { row: 0, col: 0, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(null, '', request));

  expect(result.ids).toContain(0);
  expect(result.entities[0]?.selectedPosition).toBeUndefined();
});

test('clicks an unselected tile - action', async () => {
  const piece = makePiece('ROOK', 'WHITE', 0, 0);
  const storeWithRook = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      pieces: mockEntityAdapterState(piece)
    }
  });

  await waitFor(() => storeWithRook.dispatch(clickTile({ row: 0, col: 0, gameId: 0 })));

  expect(storeWithRook.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: true
    })
  );
});

test('clicks an unselected tile - reducer', async () => {
  const request = { row: 0, col: 0, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(true, '', request));

  expect(result.ids).toContain(0);
  expect(result.entities[0]?.selectedPosition).toEqual(
    expect.objectContaining({
      row: request.row,
      col: request.col
    })
  );
});

test('clicks a selected tile - action', async () => {
  const selectedStore = mockStore({
    ...testStore,
    boards: mockEntityAdapterState({ id: 0, selectedPosition: { row: 0, col: 0 } })
  });

  await waitFor(() => selectedStore.dispatch(clickTile({ row: 0, col: 0, gameId: 0 })));

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: false
    })
  );
});

test('clicks a selected tile - reducer', async () => {
  const request = { row: 0, col: 0, gameId: 0 };
  const result = reducer(undefined, clickTile.fulfilled(false, '', request));

  expect(result.ids).toContain(0);
  expect(result.entities[0]?.selectedPosition).toBeUndefined();
});

test('moves a piece - action', async () => {
  const selectedStore = mockStore({
    ...testStore,
    boards: mockEntityAdapterState({
      id: 0,
      selectedPosition: { row: whiteMove.srcRow, col: whiteMove.srcCol }
    })
  });

  await waitFor(() =>
    selectedStore.dispatch(clickTile({ row: whiteMove.dstRow, col: whiteMove.dstCol, gameId: 0 }))
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
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

  const selectedStore = mockStore({
    ...testStore,
    boards: mockEntityAdapterState({
      id: 0,
      selectedPosition: { row: whiteTake.srcRow, col: whiteTake.srcCol }
    })
  });

  await waitFor(() =>
    selectedStore.dispatch(clickTile({ row: whiteTake.dstRow, col: whiteTake.dstCol, gameId: 0 }))
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: { ...whiteTake }
    })
  );
});

test('en passants a piece - action', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.json(whiteEnPassant));
    })
  );

  const selectedStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame
    },
    boards: mockEntityAdapterState({
      id: 0,
      selectedPosition: { row: whiteEnPassant.srcRow, col: whiteEnPassant.srcCol }
    })
  });

  await waitFor(() =>
    selectedStore.dispatch(
      clickTile({ row: whiteEnPassant.dstRow, col: whiteEnPassant.dstCol, gameId: 0 })
    )
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: { ...whiteEnPassant }
    })
  );
});

test('king side castles - action', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.json(whiteKingSideCastle));
    })
  );

  const selectedStore = mockStore({
    ...testStore,
    boards: mockEntityAdapterState({
      id: 0,
      selectedPosition: { row: whiteKingSideCastle.srcRow, col: whiteKingSideCastle.srcCol }
    })
  });

  await waitFor(() =>
    selectedStore.dispatch(
      clickTile({ row: whiteKingSideCastle.dstRow, col: whiteKingSideCastle.dstCol, gameId: 0 })
    )
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: { ...whiteKingSideCastle }
    })
  );
});

test('queen side castles - action', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.json(whiteQueenSideCastle));
    })
  );

  const selectedStore = mockStore({
    ...testStore,
    boards: mockEntityAdapterState({
      id: 0,
      selectedPosition: { row: whiteQueenSideCastle.srcRow, col: whiteQueenSideCastle.srcCol }
    })
  });

  await waitFor(() =>
    selectedStore.dispatch(
      clickTile({ row: whiteQueenSideCastle.dstRow, col: whiteQueenSideCastle.dstCol, gameId: 0 })
    )
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.fulfilled.type,
      payload: { ...whiteQueenSideCastle }
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

  const selectedStore = mockStore({
    ...testStore,
    boards: mockEntityAdapterState({
      id: 0,
      selectedPosition: { row: whiteMove.srcRow, col: whiteMove.srcCol }
    })
  });

  await waitFor(() =>
    selectedStore.dispatch(clickTile({ row: whiteMove.dstRow, col: whiteMove.dstCol, gameId: 0 }))
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.rejected.type,
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

  const selectedStore = mockStore({
    ...testStore,
    boards: mockEntityAdapterState({
      id: 0,
      selectedPosition: { row: whiteMove.srcRow, col: whiteMove.srcCol }
    })
  });

  await waitFor(() =>
    selectedStore.dispatch(clickTile({ row: whiteMove.dstRow, col: whiteMove.dstCol, gameId: 0 }))
  );

  expect(selectedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.rejected.type,
      error: expect.objectContaining({
        message
      })
    })
  );
});
