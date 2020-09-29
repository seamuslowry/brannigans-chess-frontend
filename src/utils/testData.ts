import { Game, Piece, PieceColor, PieceType, Player } from '../services/ChessService';
import { initialState } from '../store/activeGame/activeGame';
import { AlertInfo } from '../store/snackbars/snackbars';
import { AppState } from '../store/store';

export const successAlertInfo: AlertInfo = {
  message: 'test success',
  severity: 'success'
};

export const errorAlertInfo: AlertInfo = {
  message: 'test error',
  severity: 'error'
};

export const playerOne: Player = {
  id: 1,
  username: 'playerOne',
  email: 'test@test.com'
};

export const playerTwo: Player = {
  id: 2,
  username: 'playerTwo',
  email: 'test2@test.com'
};

export const makePiece = (type: PieceType, color: PieceColor): Piece => ({
  color,
  type,
  positionCol: 0,
  positionRow: 0,
  taken: false
});

export const blackRook: Piece = makePiece('ROOK', 'BLACK');

export const emptyGame: Game = {
  id: 1,
  uuid: 'empty game',
  whitePlayer: null,
  blackPlayer: null,
  winner: null
};

export const fullGame: Game = {
  id: 2,
  uuid: 'full game',
  whitePlayer: playerOne,
  blackPlayer: playerTwo,
  winner: playerOne
};

export const testStore: AppState = {
  activeGame: initialState
};
