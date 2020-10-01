import { Move, Piece, PieceColor, PieceType } from '../../services/ChessService';
import { immutableUpdate } from '../../utils/arrayHelpers';

export const SET_GAME_ID = 'chess/activeGame/SET_GAME_ID';
export const SELECT_TILE = 'chess/activeGame/SELECT_TILE';
export const SET_TILE = 'chess/activeGame/SET_TILE';
export const CLEAR_BOARD = 'chess/activeGame/CLEAR_BOARD';
export const CLEAR_GAME = 'chess/activeGame/CLEAR_GAME';
export const TAKE_PIECES = 'chess/activeGame/TAKE_PIECES';
export const CLEAR_TAKEN = 'chess/activeGame/CLEAR_TAKEN';
export const ADD_MOVES = 'chess/activeGame/ADD_MOVES';
export const CLEAR_MOVES = 'chess/activeGame/CLEAR_MOVES';

interface TileInfo {
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
  id: number;
}

const blankTile: TileInfo = {
  selected: false,
  moveable: false
};

const blankRow = new Array<TileInfo>(8).fill(blankTile);
const blankBoard = new Array<TileInfo[]>(8).fill(blankRow);

export const initialState: ActiveGameState = {
  tiles: blankBoard,
  takenPieces: [],
  moveList: [],
  id: 0
};

interface SelectTile {
  type: typeof SELECT_TILE;
  payload: {
    row: number;
    col: number;
    selected: boolean;
  };
}

interface SetTile {
  type: typeof SET_TILE;
  payload: {
    row: number;
    col: number;
    piece?: Piece;
  };
}

interface ClearBoard {
  type: typeof CLEAR_BOARD;
}

interface ClearGame {
  type: typeof CLEAR_GAME;
}

interface SetGameId {
  type: typeof SET_GAME_ID;
  payload: number;
}

interface TakePieces {
  type: typeof TAKE_PIECES;
  payload: Piece[];
}

interface ClearTaken {
  type: typeof CLEAR_TAKEN;
  payload: PieceColor;
}

interface AddMoves {
  type: typeof ADD_MOVES;
  payload: Move[];
}

interface ClearMoves {
  type: typeof CLEAR_MOVES;
}

type ActiveGameAction =
  | SelectTile
  | SetTile
  | ClearBoard
  | SetGameId
  | ClearGame
  | TakePieces
  | ClearTaken
  | AddMoves
  | ClearMoves;

export const reducer = (
  state: ActiveGameState = initialState,
  action: ActiveGameAction
): ActiveGameState => {
  switch (action.type) {
    case SET_GAME_ID:
      return {
        ...state,
        id: action.payload
      };
    case SELECT_TILE:
      return {
        ...state,
        tiles: immutableUpdate(state.tiles, action.payload.row, action.payload.col, {
          selected: action.payload.selected
        }),
        selectedPosition: action.payload.selected
          ? [action.payload.row, action.payload.col]
          : undefined
      };
    case SET_TILE:
      const { piece: setToPiece } = action.payload;
      return {
        ...state,
        tiles: immutableUpdate(state.tiles, action.payload.row, action.payload.col, {
          color: setToPiece && setToPiece.color,
          type: setToPiece && setToPiece.type
        })
      };
    case TAKE_PIECES:
      return {
        ...state,
        takenPieces: [...state.takenPieces, ...action.payload]
      };
    case ADD_MOVES:
      return {
        ...state,
        moveList: [...state.moveList, ...action.payload]
      };
    case CLEAR_BOARD:
      return {
        ...state,
        tiles: initialState.tiles,
        selectedPosition: initialState.selectedPosition
      };
    case CLEAR_TAKEN:
      return {
        ...state,
        takenPieces: state.takenPieces.filter(p => p.color !== action.payload)
      };
    case CLEAR_MOVES:
      return {
        ...state,
        moveList: initialState.moveList
      };
    case CLEAR_GAME:
      return initialState;
    default:
      return state;
  }
};

export const setGameId = (id: number): SetGameId => ({
  type: SET_GAME_ID,
  payload: id
});

export const setTile = (row: number, col: number, piece?: Piece): SetTile => ({
  type: SET_TILE,
  payload: {
    row,
    col,
    piece
  }
});

export const selectTile = (row: number, col: number, selected: boolean): SelectTile => ({
  type: SELECT_TILE,
  payload: {
    row,
    col,
    selected
  }
});

export const addMove = (move: Move): AddMoves => ({
  type: ADD_MOVES,
  payload: [move]
});

export const addMoves = (moves: Move[]): AddMoves => ({
  type: ADD_MOVES,
  payload: moves
});

export const takePiece = (piece: Piece): TakePieces => ({
  type: TAKE_PIECES,
  payload: [piece]
});

export const takePieces = (piece: Piece[]): TakePieces => ({
  type: TAKE_PIECES,
  payload: piece
});

export const clearBoard = (): ClearBoard => ({
  type: CLEAR_BOARD
});

export const clearGame = (): ClearGame => ({
  type: CLEAR_GAME
});

export const clearTaken = (color: PieceColor): ClearTaken => ({
  type: CLEAR_TAKEN,
  payload: color
});

export const clearMoves = (): ClearMoves => ({
  type: CLEAR_MOVES
});
