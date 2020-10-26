export type PieceColor = 'BLACK' | 'WHITE';

export type PieceType = 'KNIGHT' | 'BISHOP' | 'PAWN' | 'ROOK' | 'QUEEN' | 'KING';

export type PieceStatus = 'ACTIVE' | 'TAKEN' | 'REMOVED';

export type MoveType = 'EN_PASSANT' | 'KING_SIDE_CASTLE' | 'QUEEN_SIDE_CASTLE' | 'STANDARD';

export type GameStatus = 'WHITE_TURN' | 'BLACK_TURN' | 'WHITE_CHECK' | 'BLACK_CHECK';

export interface Piece {
  color: PieceColor;
  type: PieceType;
  positionRow: number;
  positionCol: number;
  status: PieceStatus;
  id: number;
}

export interface Player {
  googleId: string;
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

export interface PieceIdentitifierDto {
  gameId: number;
  row: number;
  col: number;
}
