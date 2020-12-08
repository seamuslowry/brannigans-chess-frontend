import {
  AnyAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import { Move, PieceColor } from '../../services/ChessService.types';
import { dragMove } from '../boards/boards';
import { getAllGameData } from '../games/games';
import { StompMessage, STOMP_MESSAGE } from '../middleware/stomp/stomp';

export const SHARED_MOVES_PREFIX = `/game/moves/`;
export const getSharedMovesTopic = (gameId: number) => `${SHARED_MOVES_PREFIX}${gameId}`;

interface GetMovesParams {
  gameId: number;
  colors: PieceColor[];
}

export const getMoves = createAsyncThunk(
  'chess/moves/getMoves',
  async ({ gameId, colors }: GetMovesParams) => {
    const response = await ChessService.getMoves(gameId, colors);
    return response.data;
  }
);

const movesAdapter = createEntityAdapter<Move>({
  sortComparer: (a, b) => a.id - b.id // keep moves sorted
});

export const initialState = movesAdapter.getInitialState();
export type MoveState = typeof initialState;

const moveSlice = createSlice({
  name: 'chess/moves',
  initialState,
  reducers: {
    addMoves: movesAdapter.upsertMany
  },
  extraReducers: builder => {
    builder
      .addCase(getMoves.fulfilled, (state, action) => {
        state = movesAdapter.upsertMany(state, action.payload);
      })
      .addCase(getAllGameData.fulfilled, (state, action) => {
        const updatedMoves = action.payload.moves.filter(newMove => !state.entities[newMove.id]);

        state = movesAdapter.upsertMany(state, updatedMoves);
      })
      .addCase(dragMove.fulfilled, (state, action) => {
        state = movesAdapter.upsertOne(state, action.payload);
      })
      .addMatcher(
        (action: AnyAction): action is StompMessage =>
          action.type === STOMP_MESSAGE && action.payload.topic.includes(SHARED_MOVES_PREFIX),
        (state, action) => {
          const move: Move = JSON.parse(action.payload.data);
          state = movesAdapter.upsertOne(state, move);
        }
      );
  }
});

export const { addMoves } = moveSlice.actions;

const { selectAll: selectAllMoves } = movesAdapter.getSelectors();

export default moveSlice.reducer;

export const makeSelectMoves = () =>
  createSelector(
    selectAllMoves,
    (_: MoveState, gameId: number) => gameId,
    (moves, gameId) => moves.filter(m => m.movingPiece.gameId === gameId)
  );
