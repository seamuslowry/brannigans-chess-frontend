import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import { Piece } from '../../services/ChessService.types';

export interface TilePosition {
  row: number;
  col: number;
}

interface Board {
  selectedPosition?: TilePosition; // TODO use or make into array
  id: number;
}

interface DrapMoveParams {
  piece: Piece;
  to: TilePosition;
}

export const dragMove = createAsyncThunk(
  'chess/board/dragMove',
  async ({ piece, to }: DrapMoveParams) => {
    try {
      const response = await ChessService.move(
        piece.gameId,
        piece.positionRow,
        piece.positionCol,
        to.row,
        to.col
      );
      return response.data;
    } catch (e) {
      throw new Error(e.response?.data || e.message);
    }
  }
);

const boardAdapter = createEntityAdapter<Board>();

export const initialState = boardAdapter.getInitialState();
export type BoardState = typeof initialState;

const boardSlice = createSlice({
  name: 'chess/boards',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // TODO, add ability to select / deselect tile aesthetically
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
