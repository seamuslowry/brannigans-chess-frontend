import {
  AnyAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { AppState } from '../store';
import { StompMessage, STOMP_MESSAGE } from '../middleware/stomp/stomp';
import ChessService from '../../services/ChessService';
import {
  PieceColor,
  Piece,
  Move,
  GameStatus,
  Player,
  Game,
  PieceStatus
} from '../../services/ChessService.types';
import { clickTile, TilePosition } from '../boards/boards';

export const getStatusTopic = (gameId: number) => `/game/status/${gameId}`;
export const getSharedMovesTopic = (gameId: number) => `/game/moves/${gameId}`;

export const getPieces = createAsyncThunk(
  'chess/activeGame/getPieces',
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

const movesAdapter = createEntityAdapter<Move>();
const initialMovesState = movesAdapter.getInitialState();

const piecesAdapter = createEntityAdapter<Piece>();
const initialPiecesState = piecesAdapter.getInitialState();

export interface ActiveGameState {
  moves: typeof initialMovesState;
  pieces: typeof initialPiecesState;
  status: GameStatus | '';
  whitePlayer: Player | null;
  blackPlayer: Player | null;
  id: number;
}

export const initialState: ActiveGameState = {
  moves: initialMovesState,
  pieces: initialPiecesState,
  status: '',
  whitePlayer: null,
  blackPlayer: null,
  id: 0
};

const activeGameSlice = createSlice({
  name: 'chess/activeGame',
  initialState,
  reducers: {
    setGameId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    addPieces: (state, action: PayloadAction<Piece[]>) => {
      state.pieces = piecesAdapter.upsertMany(state.pieces, action.payload);
    },
    addMoves: (state, action: PayloadAction<Move[]>) => {
      state.moves = movesAdapter.upsertMany(state.moves, action.payload);
    },
    clearBoard: state => {
      const activeIds = (Object.values(state.pieces.entities) as Piece[])
        .filter(p => p.status === 'ACTIVE')
        .map(p => p.id);
      state.pieces = piecesAdapter.removeMany(state.pieces, activeIds);
    },
    clearTaken: (state, action: PayloadAction<PieceColor>) => {
      const takenColorIds = (Object.values(state.pieces.entities) as Piece[])
        .filter(p => p.status === 'TAKEN' && p.color === action.payload)
        .map(p => p.id);
      state.pieces = piecesAdapter.removeMany(state.pieces, takenColorIds);
    },
    clearMoves: state => {
      state.moves = initialState.moves;
    },
    clearGame: state => {
      state = initialState;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getPieces.fulfilled, (state, action) => {
        state.pieces = piecesAdapter.upsertMany(state.pieces, action.payload);
      })
      .addCase(clickTile.fulfilled, (state, action) => {
        if (action.payload && typeof action.payload === 'object') {
          const move = action.payload;

          let newPieces = [move.movingPiece];
          newPieces = move.takenPiece ? newPieces.concat(move.takenPiece) : newPieces;
          state.pieces = piecesAdapter.upsertMany(state.pieces, newPieces);
          state.moves = movesAdapter.upsertOne(state.moves, move);
          if (move.moveType === 'KING_SIDE_CASTLE') {
            const oldCastle = Object.values(state.pieces.entities).find(
              c => c?.positionRow === move.srcRow && c?.positionCol === move.dstCol + 1
            );
            oldCastle &&
              piecesAdapter.upsertOne(state.pieces, {
                ...oldCastle,
                positionCol: move.dstCol - 1
              });
          }
          if (move.moveType === 'QUEEN_SIDE_CASTLE') {
            const oldCastle = Object.values(state.pieces.entities).find(
              c => c?.positionRow === move.srcRow && c?.positionCol === move.dstCol - 2
            );
            oldCastle &&
              piecesAdapter.upsertOne(state.pieces, {
                ...oldCastle,
                positionCol: move.dstCol + 1
              });
          }
        }
      })
      .addMatcher(
        (action: AnyAction): action is StompMessage => action.type === STOMP_MESSAGE,
        (state, action) => {
          if (action.payload.topic === getStatusTopic(state.id)) {
            const game: Game = JSON.parse(action.payload.data);
            state.status = game.status;
            state.whitePlayer = game.whitePlayer;
            state.blackPlayer = game.blackPlayer;
          }
          if (action.payload.topic === getSharedMovesTopic(state.id)) {
            const move: Move = JSON.parse(action.payload.data);
            movesAdapter.upsertOne(state.moves, move);
            move.takenPiece && piecesAdapter.upsertOne(state.pieces, move.takenPiece);
          }
        }
      );
  }
});

export const {
  setGameId,
  addPieces,
  addMoves,
  clearBoard,
  clearTaken,
  clearMoves,
  clearGame
} = activeGameSlice.actions;

export const { selectAll: selectAllMoves } = movesAdapter.getSelectors<AppState>(
  state => state.activeGame.moves
);

const { selectAll: selectAllPieces } = piecesAdapter.getSelectors<AppState>(
  state => state.activeGame.pieces
);

export const makeGetTakenPieces = () =>
  createSelector(
    selectAllPieces,
    (_: AppState, color: PieceColor) => color,
    (pieces, color) => pieces.filter(p => p.color === color && p.status === 'TAKEN')
  );

export const makeGetActivePiece = () =>
  createSelector(
    selectAllPieces,
    (_: AppState, position: TilePosition) => position,
    (pieces, position) =>
      pieces.find(
        p =>
          p.positionRow === position.row && p.positionCol === position.col && p.status === 'ACTIVE'
      )
  );

export const makeGetPromatablePawn = () =>
  createSelector(
    selectAllPieces,
    (_: AppState, row: number) => row,
    (pieces, row) =>
      pieces.find(p => p.type === 'PAWN' && p.positionRow === row && p.status === 'ACTIVE')
  );

export default activeGameSlice.reducer;
