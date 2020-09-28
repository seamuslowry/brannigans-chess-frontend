import { Game, Piece, Player } from '../services/ChessService';
import { initialState } from '../store/activeGame/activeGame';
import { AppState } from '../store/store';

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

export const blackRook: Piece = {
  color: 'BLACK',
  type: 'ROOK',
  positionCol: 0,
  positionRow: 0,
  taken: false
};

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
