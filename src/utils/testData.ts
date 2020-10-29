import { Game, Move, Piece, PieceColor, PieceType, Player } from '../services/ChessService.types';
import { initialState as initialActiveGameState } from '../store/activeGame/activeGame';
import { GoogleLoginRequired, initialState as initialAuthState } from '../store/auth/auth';
import {
  initialState as initialNotificationsState,
  AlertInfo
} from '../store/notifications/notifications';
import { initialState as initialSocketState } from '../store/socket/socket';
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
  googleId: 'playerOne'
};

export const playerTwo: Player = {
  id: 2,
  googleId: 'playerTwo'
};

export const makePiece = (type: PieceType, color: PieceColor): Piece => ({
  color,
  type,
  positionCol: 0,
  positionRow: 0,
  status: 'ACTIVE',
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
  moveType: 'STANDARD',
  id: 1
};

export const whiteTake: Move = {
  movingPiece: makePiece('ROOK', 'WHITE'),
  takenPiece: makePiece('ROOK', 'BLACK'),
  srcRow: 7,
  srcCol: 0,
  dstRow: 4,
  dstCol: 0,
  moveType: 'STANDARD',
  id: 2
};

export const blackMove: Move = {
  movingPiece: makePiece('ROOK', 'BLACK'),
  takenPiece: null,
  srcRow: 0,
  srcCol: 0,
  dstRow: 4,
  dstCol: 0,
  moveType: 'STANDARD',
  id: 3
};

export const blackTake: Move = {
  movingPiece: makePiece('ROOK', 'BLACK'),
  takenPiece: makePiece('ROOK', 'WHITE'),
  srcRow: 0,
  srcCol: 0,
  dstRow: 4,
  dstCol: 0,
  moveType: 'STANDARD',
  id: 4
};

export const whiteEnPassant: Move = {
  movingPiece: makePiece('PAWN', 'WHITE'),
  takenPiece: makePiece('PAWN', 'BLACK'),
  srcRow: 3,
  srcCol: 3,
  dstRow: 2,
  dstCol: 2,
  moveType: 'EN_PASSANT',
  id: 2
};

export const whiteKingSideCastle: Move = {
  movingPiece: makePiece('KING', 'WHITE'),
  takenPiece: null,
  srcRow: 7,
  srcCol: 4,
  dstRow: 7,
  dstCol: 6,
  moveType: 'KING_SIDE_CASTLE',
  id: 2
};

export const whiteQueenSideCastle: Move = {
  movingPiece: makePiece('KING', 'WHITE'),
  takenPiece: null,
  srcRow: 7,
  srcCol: 4,
  dstRow: 7,
  dstCol: 2,
  moveType: 'QUEEN_SIDE_CASTLE',
  id: 2
};

export const loginResponse: GoogleLoginRequired = {
  profileObj: {
    email: 'test@email.com',
    givenName: 'given',
    familyName: 'familyName',
    googleId: 'id',
    imageUrl: '',
    name: 'name'
  },
  tokenObj: {
    access_token: '',
    login_hint: '',
    id_token: '',
    expires_at: 0,
    expires_in: 10,
    scope: '',
    first_issued_at: 0
  },
  tokenId: 'test'
};

export const testStore: AppState = {
  activeGame: initialActiveGameState,
  notifications: initialNotificationsState,
  socket: initialSocketState,
  auth: initialAuthState
};
