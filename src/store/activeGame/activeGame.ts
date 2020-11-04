import {
  AnyAction,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import {
  PieceColor,
  PieceType,
  Piece,
  Move,
  GameStatus,
  Player,
  Game
} from '../../services/ChessService.types';
import { StompMessage, STOMP_MESSAGE } from '../middleware/stomp/stomp';
import { AppState } from '../store';

export const getStatusTopic = (gameId: number) => `/game/status/${gameId}`;

export interface TilePosition {
  row: number;
  col: number;
}

export const clickTile = createAsyncThunk<null | boolean | Move, TilePosition, { state: AppState }>(
  'chess/activeGame/clickTile',
  async (position: TilePosition, { getState }) => {
    const { row, col } = position;
    const { selectedPosition, id: gameId, tiles } = getState().activeGame;

    if (selectedPosition && selectedPosition[0] === row && selectedPosition[1] === col) {
      return false;
    } else if (selectedPosition) {
      try {
        const response = await ChessService.move(
          gameId,
          selectedPosition[0],
          selectedPosition[1],
          row,
          col
        );
        return response.data;
      } catch (e) {
        throw new Error(e.response?.data || e.message);
      }
    } else if (tiles[row][col].type) {
      return true;
    }

    return null;
  }
);

export const getPieces = createAsyncThunk('chess/activeGame/getPieces', async (gameId: number) => {
  const response = await ChessService.getPieces(gameId, undefined, 'ACTIVE');
  return response.data;
});

export interface TileInfo {
  color?: PieceColor;
  type?: PieceType;
  selected: boolean;
  moveable: boolean;
}

const movesAdapter = createEntityAdapter<Move>();
const initialMoveState = movesAdapter.getInitialState();

export interface ActiveGameState {
  tiles: TileInfo[][];
  // TODO refactor to use TilePosition interface
  selectedPosition?: [number, number];
  takenPieces: Piece[];
  moves: typeof initialMoveState;
  status: GameStatus | '';
  whitePlayer: Player | null;
  blackPlayer: Player | null;
  id: number;
}

const blankTile: TileInfo = {
  selected: false,
  moveable: false
};

const blankRow = new Array<TileInfo>(8).fill(blankTile);
const blankBoard = new Array<TileInfo[]>(8).fill(blankRow);

interface AgnosticPiece {
  color: PieceColor;
  type: PieceType;
}

export const initialState: ActiveGameState = {
  tiles: blankBoard,
  takenPieces: [],
  moves: initialMoveState,
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
    selectTile: {
      reducer: (
        state,
        action: PayloadAction<{
          row: number;
          col: number;
          selected: boolean;
        }>
      ) => {
        const { row, col, selected } = action.payload;
        state.tiles[row][col].selected = selected;
        state.selectedPosition = selected ? [row, col] : undefined;
      },
      prepare: (row: number, col: number, selected: boolean) => ({
        payload: {
          row,
          col,
          selected
        }
      })
    },
    setTile: {
      reducer: (
        state,
        action: PayloadAction<{
          row: number;
          col: number;
          piece?: AgnosticPiece;
        }>
      ) => {
        const { row, col, piece } = action.payload;
        state.tiles[row][col].color = piece?.color;
        state.tiles[row][col].type = piece?.type;
      },
      prepare: (row: number, col: number, piece?: AgnosticPiece) => ({
        payload: {
          row,
          col,
          piece
        }
      })
    },
    takePieces: (state, action: PayloadAction<Piece[]>) => {
      state.takenPieces.push(...action.payload);
    },
    addMoves: (state, action: PayloadAction<Move[]>) => {
      state.moves = movesAdapter.upsertMany(state.moves, action.payload);
    },
    clearBoard: state => {
      state.tiles = initialState.tiles;
      state.selectedPosition = initialState.selectedPosition;
    },
    clearTaken: (state, action: PayloadAction<PieceColor>) => {
      state.takenPieces = state.takenPieces.filter(p => p.color !== action.payload);
    },
    clearMoves: state => {
      state.moves = initialState.moves;
    },
    clearGame: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(getPieces.fulfilled, (state, action) => {
        action.payload.forEach(piece => {
          state.tiles[piece.positionRow][piece.positionCol] = {
            type: piece.type,
            color: piece.color,
            selected: false,
            moveable: false
          };
        });
      })
      .addCase(clickTile.fulfilled, (state, action) => {
        const { row, col } = action.meta.arg;
        if (action.payload === false) {
          state.tiles[row][col].selected = false;
          state.selectedPosition = undefined;
        } else if (action.payload === true) {
          state.tiles[row][col].selected = true;
          state.selectedPosition = [row, col];
        } else if (action.payload) {
          // TODO improve this whole thing with an entity manager and selectors for Piece and Move
          const move = action.payload;
          state.selectedPosition = undefined;
          state.tiles[move.srcRow][move.srcCol] = {
            ...blankTile
          };
          state.tiles[move.dstRow][move.dstCol] = {
            ...blankTile,
            type: move.movingPiece.type,
            color: move.movingPiece.color
          };
          state.moves = movesAdapter.upsertOne(state.moves, move);
          move.takenPiece && state.takenPieces.push(move.takenPiece);
          if (move.moveType === 'EN_PASSANT') {
            state.tiles[move.srcRow][move.dstCol] = { ...blankTile };
          }
          if (move.moveType === 'KING_SIDE_CASTLE') {
            const oldCastle = state.tiles[move.srcRow][move.dstCol + 1];
            state.tiles[move.srcRow][move.dstCol - 1] = { ...oldCastle };
            state.tiles[move.srcRow][move.dstCol + 1] = { ...blankTile };
          }
          if (move.moveType === 'QUEEN_SIDE_CASTLE') {
            const oldCastle = state.tiles[move.srcRow][move.dstCol - 2];
            state.tiles[move.srcRow][move.dstCol + 1] = { ...oldCastle };
            state.tiles[move.srcRow][move.dstCol - 2] = { ...blankTile };
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
  selectTile,
  setTile,
  takePieces,
  addMoves,
  clearBoard,
  clearTaken,
  clearMoves,
  clearGame
} = activeGameSlice.actions;

export const { selectAll: selectAllMoves } = movesAdapter.getSelectors<AppState>(
  state => state.activeGame.moves
);

export default activeGameSlice.reducer;
