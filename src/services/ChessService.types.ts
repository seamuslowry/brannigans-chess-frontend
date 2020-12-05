export type PieceColor = 'BLACK' | 'WHITE';

export type PieceType = 'KNIGHT' | 'BISHOP' | 'PAWN' | 'ROOK' | 'QUEEN' | 'KING';

export type PieceStatus = 'ACTIVE' | 'TAKEN' | 'REMOVED';

export type MoveType = 'EN_PASSANT' | 'KING_SIDE_CASTLE' | 'QUEEN_SIDE_CASTLE' | 'STANDARD';

export type GameStatus =
  | 'WAITING_FOR_PLAYERS'
  | 'WAITING_FOR_WHITE'
  | 'WAITING_FOR_BLACK'
  | 'WHITE_TURN'
  | 'BLACK_TURN'
  | 'WHITE_CHECK'
  | 'BLACK_CHECK'
  | 'WHITE_PROMOTION'
  | 'BLACK_PROMOTION'
  | 'STALEMATE'
  | 'WHITE_CHECKMATE'
  | 'BLACK_CHECKMATE';

export enum GameStatusGroup {
  OPEN = 1,
  ACTIVE,
  INACTIVE
}

export type StatusGroupMap = {
  [key in GameStatusGroup]: GameStatus[];
};

export interface Piece {
  color: PieceColor;
  type: PieceType;
  positionRow: number;
  positionCol: number;
  status: PieceStatus;
  gameId: number;
  id: number;
}

export interface PlayerStatInfo {
  whiteGames: number;
  blackGames: number;
  whiteWins: number;
  blackWins: number;
  whiteDraws: number;
  blackDraws: number;
}

export interface Player {
  authId: string;
  name: string;
  imageUrl: string;
  id: number;
}

export interface Game {
  uuid: string;
  whitePlayer: Player | null;
  blackPlayer: Player | null;
  winner: Player | null;
  status: GameStatus;
  id: number;
}

export interface Move {
  movingPiece: Piece;
  takenPiece: Piece | null;
  srcRow: number;
  srcCol: number;
  dstRow: number;
  dstCol: number;
  moveType: MoveType;
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

export interface AdditionalPlayerInfo {
  name: string;
  imageUrl: string;
}

export interface AllGameData {
  game: Game;
  pieces: Piece[];
  move: Move[];
}
