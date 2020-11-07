import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import { waitFor } from '@testing-library/dom';
import createMockStore from 'redux-mock-store';
import { testStore, makePiece, mockEntityAdapterState } from '../../utils/testData';
import { clickTile } from '../activeGame/activeGame';
import reducer from './boards';
import { AppState } from '../store';

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
