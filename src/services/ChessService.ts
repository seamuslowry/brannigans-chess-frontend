import { chessApi } from './Api';

export type PieceColor = 'BLACK' | 'WHITE';

export type PieceType = 'KNIGHT' | 'BISHOP' | 'PAWN' | 'ROOK' | 'QUEEN' | 'KING';

export interface Piece {
  color: PieceColor;
  type: PieceType;
  positionRow: number;
  positionCol: number;
  taken: boolean;
  id: number;
}

export interface Player {
  username: string;
  email: string;
  id: number;
}

export interface Game {
  uuid: string;
  whitePlayer: Player | null;
  blackPlayer: Player | null;
  winner: Player | null;
  id: number;
}

export interface Move {
  movingPiece: Piece;
  takenPiece: Piece | null;
  srcRow: number;
  srcCol: number;
  dstRow: number;
  dstCol: number;
  id: number;
}

export interface PageRequest {
  page: number;
  size: number;
  orderBy: string;
  order: 'asc' | 'desc';
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

const getGames = (active?: boolean, pageRequest: Partial<PageRequest> = {}) => {
  const { page, size, order, orderBy } = pageRequest;

  const args = [];

  active !== undefined && args.push(`active=${active}`);

  page && args.push(`page=${page}`);
  size && args.push(`size=${size}`);
  order && args.push(`active=${order}`);
  orderBy && args.push(`orderBy=${orderBy}`);

  return chessApi.get<PageResponse<Game>>(`/games?${args.join('&')}`);
};

const getPieces = (gameId: number, color?: PieceColor, taken?: boolean) => {
  const args = [];

  taken !== undefined && args.push(`taken=${taken}`);

  color && args.push(`color=${color}`);

  return chessApi.get<Piece[]>(`pieces/${gameId}?${args.join('&')}`);
};

const getMoves = (gameId: number, color?: PieceColor) => {
  const args = [];

  color && args.push(`color=${color}`);

  return chessApi.get<Move[]>(`moves/${gameId}?${args.join('&')}`);
};

const move = (gameId: number, srcRow: number, srcCol: number, dstRow: number, dstCol: number) =>
  chessApi.post<Move>(`moves/${gameId}`, {
    srcRow,
    srcCol,
    dstRow,
    dstCol
  });

const createGame = () => chessApi.post<Game>('games/create');

export default {
  getGames,
  getPieces,
  getMoves,
  createGame,
  move
};
