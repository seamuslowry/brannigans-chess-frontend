import ChessService, { Piece, PieceColor, PieceType } from '../../services/ChessService';
import { flatten, immutableUpdate } from '../../utils/arrayHelpers';
import { ThunkResult } from '../store';

export const SELECT_TILE = 'chess/activeGame/SELECT_TILE';
export const SET_TILE = 'chess/activeGame/SET_TILE';

interface TileInfo {
  color?: PieceColor;
  type?: PieceType;
  selected: boolean;
  moveable: boolean;
}

export interface ActiveGameState {
  tiles: TileInfo[][];
}

const blankTile: TileInfo = {
  selected: false,
  moveable: false
};

const blankRow = new Array<TileInfo>(8).fill(blankTile);
const blankBoard = new Array<TileInfo[]>(8).fill(blankRow);

export const initialState: ActiveGameState = {
  tiles: blankBoard
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

type ActiveGameAction = SelectTile | SetTile;

export const reducer = (
  state: ActiveGameState = initialState,
  action: ActiveGameAction
): ActiveGameState => {
  switch (action.type) {
    case SELECT_TILE:
      return {
        ...state,
        tiles: immutableUpdate(state.tiles, action.payload.row, action.payload.col, {
          selected: action.payload.selected
        })
      };
    case SET_TILE:
      const setToPiece = action.payload.piece;
      return {
        ...state,
        tiles: immutableUpdate(state.tiles, action.payload.row, action.payload.col, {
          color: setToPiece && setToPiece.color,
          type: setToPiece && setToPiece.type
        })
      };
    default:
      return initialState;
  }
};

export const clickTile = (row: number, col: number): ThunkResult<void> => (dispatch, getState) => {
  const selectedTile = flatten(getState().activeGame.tiles).find(r => r.selected);

  if (selectedTile) {
    // TODO attempt to move to selected tile
    dispatch(selectTile(row, col, false));
  } else {
    dispatch(selectTile(row, col, true));
  }
};

export const getPieces = (gameId: number): ThunkResult<void> => async dispatch => {
  return ChessService.getPieces(gameId, undefined, false)
    .then(res => {
      res.data.forEach(piece => {
        dispatch(setTile(piece.positionRow, piece.positionCol, piece));
      });
    })
    .catch(error => {
      // TODO update to use better error framework
      console.error('could not get pieces for game');
    });
};

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
