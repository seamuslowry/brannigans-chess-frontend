import { chessApi } from './Api';
import {
  AdditionalPlayerInfo,
  Game,
  Move,
  PageRequest,
  PageResponse,
  Piece,
  PieceColor,
  PieceStatus,
  PieceType,
  Player
} from './ChessService.types';

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

const getPieces = (gameId: number, colors?: PieceColor[], status?: PieceStatus) => {
  const args = [];

  status && args.push(`status=${status}`);

  colors && args.push(`color=${colors.join('&color=')}`);

  return chessApi.get<Piece[]>(`pieces/${gameId}?${args.join('&')}`);
};

const getMoves = (gameId: number, colors?: PieceColor[]) => {
  const args = [];

  colors && args.push(`color=${colors.join('&color=')}`);

  return chessApi.get<Move[]>(`moves/${gameId}?${args.join('&')}`);
};

const move = (gameId: number, srcRow: number, srcCol: number, dstRow: number, dstCol: number) =>
  chessApi.post<Move>(`moves/${gameId}`, {
    srcRow,
    srcCol,
    dstRow,
    dstCol
  });

const promote = (pieceId: number, type: PieceType) =>
  chessApi.post<Piece>(`pieces/promote/${pieceId}/${type}`);

const createGame = () => chessApi.post<Game>('games/create');

const authenticatePlayer = (playerInfo: AdditionalPlayerInfo) =>
  chessApi.post<Player>('players/auth', playerInfo);

const joinGame = (gameId: number, color: PieceColor) =>
  chessApi.post<Game>(`players/join/${gameId}?color=${color}`);

const leaveGame = (gameId: number) => chessApi.post<Game>(`players/leave/${gameId}`);

export default {
  getGames,
  getPieces,
  getMoves,
  createGame,
  promote,
  move,
  authenticatePlayer,
  joinGame,
  leaveGame
};
