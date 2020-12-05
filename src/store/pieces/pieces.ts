import {
  AnyAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import { Move, Piece, PieceColor, PieceStatus, PieceType } from '../../services/ChessService.types';
import { clickTile, TilePosition } from '../boards/boards';
import { getAllGameData, joinGame } from '../games/games';
import { StompMessage, STOMP_MESSAGE } from '../middleware/stomp/stomp';
import { SHARED_MOVES_PREFIX } from '../moves/moves';

interface GetPiecesParams {
  gameId: number;
  colors: PieceColor[];
  status?: PieceStatus;
}

export const getPieces = createAsyncThunk(
  'chess/pieces/getPieces',
  async ({ gameId, colors, status }: GetPiecesParams) => {
    const response = await ChessService.getPieces(gameId, colors, status);
    return response.data;
  }
);

interface PromotePawnParams {
  pieceId: number;
  type: PieceType;
}

export const promotePawn = createAsyncThunk(
  'chess/pieces/promotePawn',
  async ({ pieceId, type }: PromotePawnParams) => {
    const res = await ChessService.promote(pieceId, type);
    return res.data;
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
      // do not need a case for leaving a game because that should not remove pieces
      .addCase(joinGame.fulfilled, (state, action) => {
        const { gameId, pieceColor } = action.meta.arg;
        const removePieces = Object.values(state.entities).filter(
          p => p?.gameId === gameId && p.color !== pieceColor
        ) as Piece[];
        const removeIds = removePieces.map(p => p.id);
        state = piecesAdapter.removeMany(state, removeIds);
      })
      .addCase(getAllGameData.fulfilled, (state, action) => {
        const updatedPieces = action.payload.pieces.filter(newPiece => {
          const oldPiece = state.entities[newPiece.id];

          return !(
            oldPiece &&
            oldPiece.positionCol === newPiece.positionCol &&
            oldPiece.positionRow === newPiece.positionRow &&
            oldPiece.status === newPiece.status
          );
        });

        state = piecesAdapter.upsertMany(state, updatedPieces);
      })
      .addCase(getPieces.fulfilled, (state, action) => {
        state = piecesAdapter.upsertMany(state, action.payload);
      })
      .addCase(promotePawn.fulfilled, (state, action) => {
        const pawnId = action.meta.arg.pieceId;
        state = piecesAdapter.upsertOne(state, action);
        state = piecesAdapter.updateOne(state, { id: pawnId, changes: { status: 'REMOVED' } });
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
        (action: AnyAction): action is StompMessage =>
          action.type === STOMP_MESSAGE && action.payload.topic.includes(SHARED_MOVES_PREFIX),
        (state, action) => {
          const move: Move = JSON.parse(action.payload.data);
          move.takenPiece && (state = piecesAdapter.upsertOne(state, move.takenPiece));
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
      pieces.filter(p => p.gameId === gameId && p.color === color && p.status === 'TAKEN')
  );

export const makeGetActivePiece = () =>
  createSelector(
    selectAllPieces,
    (_: PieceState, gameId: number) => gameId,
    (_: PieceState, __, position: TilePosition) => position,
    (pieces, gameId, position) =>
      pieces.find(
        p =>
          p.gameId === gameId &&
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
          p.gameId === gameId && p.type === 'PAWN' && p.positionRow === row && p.status === 'ACTIVE'
      )
  );
