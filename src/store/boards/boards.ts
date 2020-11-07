import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import { Move } from '../../services/ChessService.types';
import { AppState } from '../store';

export interface TilePosition {
  row: number;
  col: number;
}

interface Board {
  selectedPosition?: TilePosition;
  id: number;
}

interface ClickTileParams extends TilePosition {
  gameId: number;
}

export const clickTile = createAsyncThunk<
  null | boolean | Move,
  ClickTileParams,
  { state: AppState }
>('chess/activeGame/clickTile', async (position, { getState }) => {
  const { row, col, gameId } = position;
  const { pieces } = getState();
  const selectedPosition = getState().boards.entities[gameId]?.selectedPosition;

  if (selectedPosition && selectedPosition.row === row && selectedPosition.col === col) {
    return false;
  } else if (selectedPosition) {
    try {
      const response = await ChessService.move(
        gameId,
        selectedPosition.row,
        selectedPosition.col,
        row,
        col
      );
      return response.data;
    } catch (e) {
      throw new Error(e.response?.data || e.message);
    }
  } else if (
    Object.values(pieces.entities).find(p => p?.positionCol === col && p?.positionRow === row)
  ) {
    return true;
  }

  return null;
});

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
        selectedPosition: action.payload === true ? { row, col } : undefined
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
