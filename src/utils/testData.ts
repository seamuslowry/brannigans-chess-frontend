import { Game, Move, Piece, PieceColor, PieceType, Player } from '../services/ChessService';
import { initialState as initialActiveGameState } from '../store/activeGame/activeGame';
import {
  initialState as initialNotificationsState,
  AlertInfo
} from '../store/notifications/notifications';
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
  taken: false,
  id: Number(Math.random() * 1000)
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

export const whiteMove: Move = {
  movingPiece: makePiece('ROOK', 'WHITE'),
  takenPiece: null,
  srcRow: 7,
  srcCol: 0,
  dstRow: 4,
  dstCol: 0,
  id: 1
};

export const whiteTake: Move = {
  movingPiece: makePiece('ROOK', 'WHITE'),
  takenPiece: makePiece('ROOK', 'BLACK'),
  srcRow: 7,
  srcCol: 0,
  dstRow: 4,
  dstCol: 0,
  id: 2
};

export const blackMove: Move = {
  movingPiece: makePiece('ROOK', 'BLACK'),
  takenPiece: null,
  srcRow: 0,
  srcCol: 0,
  dstRow: 4,
  dstCol: 0,
  id: 3
};

export const blackTake: Move = {
  movingPiece: makePiece('ROOK', 'BLACK'),
  takenPiece: makePiece('ROOK', 'WHITE'),
  srcRow: 0,
  srcCol: 0,
  dstRow: 4,
  dstCol: 0,
  id: 4
};

export const testStore: AppState = {
  activeGame: initialActiveGameState,
  notifications: initialNotificationsState
};
