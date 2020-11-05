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
  Game
} from '../../services/ChessService.types';

export const getStatusTopic = (gameId: number) => `/game/status/${gameId}`;

export interface TilePosition {
  row: number;
  col: number;
}

export const clickTile = createAsyncThunk<null | boolean | Move, TilePosition, { state: AppState }>(
  'chess/activeGame/clickTile',
  async (position: TilePosition, { getState }) => {
    const { row, col } = position;
    const { selectedPosition, id: gameId, pieces } = getState().activeGame;

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
  }
);

export const getPieces = createAsyncThunk('chess/activeGame/getPieces', async (gameId: number) => {
  const response = await ChessService.getPieces(gameId, undefined, 'ACTIVE');
  return response.data;
});

const movesAdapter = createEntityAdapter<Move>();
const initialMovesState = movesAdapter.getInitialState();

const piecesAdapter = createEntityAdapter<Piece>();
const initialPiecesState = piecesAdapter.getInitialState();

export interface ActiveGameState {
  selectedPosition?: TilePosition;
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

      state.selectedPosition = initialState.selectedPosition;
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
        const { row, col } = action.meta.arg;
        if (action.payload === false) {
          state.selectedPosition = undefined;
        } else if (action.payload === true) {
          state.selectedPosition = { row, col };
        } else if (action.payload) {
          const move = action.payload;
          state.selectedPosition = undefined;

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

export const makeGetSelected = () =>
  createSelector(
    state => state.activeGame.selectedPosition,
    (_: AppState, position: TilePosition) => position,
    (selectedPostion, givenPosition) =>
      !!selectedPostion &&
      selectedPostion.row === givenPosition.row &&
      selectedPostion.col === givenPosition.col
  );

export const makeGetPromatablePawn = () =>
  createSelector(
    selectAllPieces,
    (_: AppState, row: number) => row,
    (pieces, row) =>
      pieces.find(p => p.type === 'PAWN' && p.positionRow === row && p.status === 'ACTIVE')
  );

export default activeGameSlice.reducer;
