import { Auth0ContextInterface } from '@auth0/auth0-react';
import { Game, Move, Piece, PieceColor, PieceType, Player } from '../services/ChessService.types';
import { initialState as initialActiveGameState } from '../store/activeGame/activeGame';
import { initialState as initialAuthState } from '../store/auth/auth';
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
  authId: 'playerOne'
};

export const playerTwo: Player = {
  id: 2,
  authId: 'playerTwo'
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
  winner: null,
  status: 'WAITING_FOR_PLAYERS'
};

export const fullGame: Game = {
  id: 2,
  uuid: 'full game',
  whitePlayer: playerOne,
  blackPlayer: playerTwo,
  winner: playerOne,
  status: 'WHITE_TURN'
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

export const unauthenticatedAuth0: Auth0ContextInterface = {
  isAuthenticated: false,
  getAccessTokenSilently: jest.fn(),
  getAccessTokenWithPopup: jest.fn(),
  getIdTokenClaims: jest.fn(),
  loginWithPopup: jest.fn(),
  loginWithRedirect: jest.fn(),
  logout: jest.fn(),
  isLoading: false,
  user: {
    name: 'test name',
    picture: 'test-picture.jpg'
  }
};

export const authenticatedAuth0 = {
  ...unauthenticatedAuth0,
  isAuthenticated: true
};

export const testStore: AppState = {
  activeGame: initialActiveGameState,
  notifications: initialNotificationsState,
  socket: initialSocketState,
  auth: initialAuthState
};
