import {
  AnyAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import { Move, Piece, PieceColor, PieceStatus } from '../../services/ChessService.types';
import { clickTile, TilePosition } from '../boards/boards';
import { StompMessage, STOMP_MESSAGE } from '../middleware/stomp/stomp';
import { SHARED_MOVES_PREFIX } from '../moves/moves';

export const getPieces = createAsyncThunk(
  'chess/pieces/getPieces',
  async ({
    gameId,
    colors,
    status
  }: {
    gameId: number;
    colors: PieceColor[];
    status?: PieceStatus;
  }) => {
    const response = await ChessService.getPieces(gameId, colors, status);
    return response.data;
  }
);

const piecesAdapter = createEntityAdapter<Piece>();

export const initialState = piecesAdapter.getInitialState();
export type PieceState = typeof initialState;

const pieceSlice = createSlice({
  name: 'chess/pieces',
  initialState,
  reducers: {
    addPieces: piecesAdapter.upsertMany
  },
  extraReducers: builder => {
    builder
      .addCase(getPieces.fulfilled, (state, action) => {
        state = piecesAdapter.upsertMany(state, action.payload);
      })
      .addCase(clickTile.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object') {
          const move = action.payload;

          let newPieces = [move.movingPiece];
          newPieces = move.takenPiece ? newPieces.concat(move.takenPiece) : newPieces;
          state = piecesAdapter.upsertMany(state, newPieces);

          if (move.moveType === 'KING_SIDE_CASTLE') {
            const oldCastle = Object.values(state.entities).find(
              c => c?.positionRow === move.srcRow && c?.positionCol === move.dstCol + 1
            );
            oldCastle &&
              piecesAdapter.upsertOne(state, {
                ...oldCastle,
                positionCol: move.dstCol - 1
              });
          }
          if (move.moveType === 'QUEEN_SIDE_CASTLE') {
            const oldCastle = Object.values(state.entities).find(
              c => c?.positionRow === move.srcRow && c?.positionCol === move.dstCol - 2
            );
            oldCastle &&
              piecesAdapter.upsertOne(state, {
                ...oldCastle,
                positionCol: move.dstCol + 1
              });
          }
        }
      })
      .addMatcher(
        (action: AnyAction): action is StompMessage => action.type === STOMP_MESSAGE,
        (state, action) => {
          if (action.payload.topic.includes(SHARED_MOVES_PREFIX)) {
            const move: Move = JSON.parse(action.payload.data);
            move.takenPiece && (state = piecesAdapter.upsertOne(state, move.takenPiece));
          }
        }
      );
  }
});

export const { addPieces } = pieceSlice.actions;

const { selectAll: selectAllPieces } = piecesAdapter.getSelectors();

export default pieceSlice.reducer;

export const makeGetTakenPieces = () =>
  createSelector(
    selectAllPieces,
    (_: PieceState, gameId: number) => gameId,
    (_: PieceState, __, color: PieceColor) => color,
    (pieces, gameId, color) =>
      pieces.filter(p => p.game.id === gameId && p.color === color && p.status === 'TAKEN')
  );

export const makeGetActivePiece = () =>
  createSelector(
    selectAllPieces,
    (_: PieceState, gameId: number) => gameId,
    (_: PieceState, __, position: TilePosition) => position,
    (pieces, gameId, position) =>
      pieces.find(
        p =>
          p.game.id === gameId &&
          p.positionRow === position.row &&
          p.positionCol === position.col &&
          p.status === 'ACTIVE'
      )
  );

export const makeGetPromatablePawn = () =>
  createSelector(
    selectAllPieces,
    (_: PieceState, gameId: number) => gameId,
    (_: PieceState, __, row: number) => row,
    (pieces, gameId, row) =>
      pieces.find(
        p =>
          p.game.id === gameId &&
          p.type === 'PAWN' &&
          p.positionRow === row &&
          p.status === 'ACTIVE'
      )
  );
