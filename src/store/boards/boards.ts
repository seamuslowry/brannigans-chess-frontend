import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { clickTile } from '../activeGame/activeGame';

export interface TilePosition {
  row: number;
  col: number;
}

interface Board {
  selectedPosition?: TilePosition;
  id: number;
}

const boardAdapter = createEntityAdapter<Board>();

export const initialState = boardAdapter.getInitialState();
export type BoardState = typeof initialState;

const boardSlice = createSlice({
  name: 'chess/boards',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(clickTile.fulfilled, (state, action) => {
      const { row, col, gameId } = action.meta.arg;
      boardAdapter.upsertOne(state, {
        id: gameId,
        selectedPosition: action.payload ? { row, col } : undefined
      });
    });
  }
});

export const { selectById: selectBoardById } = boardAdapter.getSelectors();

export default boardSlice.reducer;

export const makeGetSelected = () =>
  createSelector(
    selectBoardById,
    (_, __, position: TilePosition) => position,
    (board, givenPosition) =>
      !!board?.selectedPosition &&
      board?.selectedPosition.row === givenPosition.row &&
      board?.selectedPosition.col === givenPosition.col
  );
