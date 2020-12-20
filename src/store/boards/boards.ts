import {
  AnyAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import { Game, Move, Piece } from '../../services/ChessService.types';
import { GAME_STATUS_PREFIX } from '../games/games';
import { StompMessage, STOMP_MESSAGE } from '../middleware/stomp/stomp';

export interface TilePosition {
  row: number;
  col: number;
}

interface Board {
  id: number;
  move?: Move;
}

interface DragMoveParams {
  piece: Piece;
  to: TilePosition;
}

export const dragMove = createAsyncThunk(
  'chess/board/dragMove',
  async ({ piece, to }: DragMoveParams) => {
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
  reducers: {
    addBoard: boardAdapter.upsertOne
  },
  extraReducers: builder => {
    builder
      .addCase(dragMove.fulfilled, (state, action) => {
        state = boardAdapter.updateOne(state, {
          id: action.payload.movingPiece.gameId,
          changes: {
            move: action.payload
          }
        });
      })
      .addMatcher(
        (action: AnyAction): action is StompMessage =>
          action.type === STOMP_MESSAGE && action.payload.topic.includes(GAME_STATUS_PREFIX),
        (state, action) => {
          const game: Game = JSON.parse(action.payload.data);
          const board = state.entities[game.id];
          const displayedMove = board?.move;

          if (displayedMove && game.status.includes(displayedMove.movingPiece.color))
            state = boardAdapter.updateOne(state, {
              id: game.id,
              changes: {
                move: undefined
              }
            });
        }
      );
  }
});

export const { addBoard } = boardSlice.actions;

export const { selectById: selectBoardById } = boardAdapter.getSelectors();

export const makeGetSource = () =>
  createSelector(
    selectBoardById,
    (_, __, position: TilePosition) => position,
    (board, givenPosition) =>
      !!board?.move &&
      board?.move.srcRow === givenPosition.row &&
      board?.move.srcCol === givenPosition.col
  );

export const makeGetDestination = () =>
  createSelector(
    selectBoardById,
    (_, __, position: TilePosition) => position,
    (board, givenPosition) =>
      !!board?.move &&
      board?.move.dstRow === givenPosition.row &&
      board?.move.dstCol === givenPosition.col
  );

export default boardSlice.reducer;
