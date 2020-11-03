import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export const getStatusTopic = (gameId: number) => `/game/status/${gameId}`;

export const asyncThunkGetPieces = createAsyncThunk(
  'chess/activeGame/thunkGetPieces',
  async (gameId: number) => {
    const response = await ChessService.getPieces(gameId, undefined, 'ACTIVE');
    return response.data;
  }
);

export interface TileInfo {
  color?: PieceColor;
  type?: PieceType;
  selected: boolean;
  moveable: boolean;
}

export interface ActiveGameState {
  tiles: TileInfo[][];
  selectedPosition?: [number, number];
  takenPieces: Piece[];
  moveList: Move[];
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
  moveList: [],
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
      state.moveList.push(...action.payload);
    },
    clearBoard: state => {
      state.tiles = initialState.tiles;
      state.selectedPosition = initialState.selectedPosition;
    },
    clearTaken: (state, action: PayloadAction<PieceColor>) => {
      state.takenPieces = state.takenPieces.filter(p => p.color !== action.payload);
    },
    clearMoves: state => {
      state.moveList = initialState.moveList;
    },
    clearGame: () => initialState
  },
  extraReducers: builder => {
    builder
      .addCase(asyncThunkGetPieces.fulfilled, (state, action) => {
        action.payload.forEach(piece => {
          state.tiles[piece.positionRow][piece.positionCol] = {
            type: piece.type,
            color: piece.color,
            selected: false,
            moveable: false
          };
        });
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

export default activeGameSlice.reducer;
