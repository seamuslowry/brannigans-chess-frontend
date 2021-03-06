import { chessApi } from './Api';
import {
  AdditionalPlayerInfo,
  AllGameData,
  Game,
  GameStatusGroup,
  Move,
  PageRequest,
  PageResponse,
  Piece,
  PieceColor,
  PieceStatus,
  PieceType,
  Player,
  PlayerStatInfo,
  StatusGroupMap
} from './ChessService.types';

export const statusGroupMap: StatusGroupMap = {
  [GameStatusGroup.OPEN]: ['WAITING_FOR_BLACK', 'WAITING_FOR_PLAYERS', 'WAITING_FOR_WHITE'],
  [GameStatusGroup.ACTIVE]: [
    'WHITE_TURN',
    'BLACK_TURN',
    'WHITE_CHECK',
    'BLACK_CHECK',
    'WHITE_PROMOTION',
    'BLACK_PROMOTION'
  ],
  [GameStatusGroup.INACTIVE]: ['WHITE_VICTORY', 'BLACK_VICTORY', 'STALEMATE']
};

const getGames = (statusGroup?: GameStatusGroup, pageRequest: Partial<PageRequest> = {}) => {
  const { page, size, order, orderBy } = pageRequest;

  const args = [];

  statusGroup && args.push(`status=${statusGroupMap[statusGroup].join('&status=')}`);

  page && args.push(`page=${page}`);
  size && args.push(`size=${size}`);
  order && args.push(`order=${order}`);
  orderBy && args.push(`orderBy=${orderBy}`);

  return chessApi.get<PageResponse<Game>>(`/games?${args.join('&')}`);
};

const getPlayerGames = (
  playerId: number,
  statusGroup?: GameStatusGroup,
  pageRequest: Partial<PageRequest> = {}
) => {
  const { page, size, order, orderBy } = pageRequest;

  const args = [];

  statusGroup && args.push(`status=${statusGroupMap[statusGroup].join('&status=')}`);

  page && args.push(`page=${page}`);
  size && args.push(`size=${size}`);
  order && args.push(`active=${order}`);
  orderBy && args.push(`orderBy=${orderBy}`);

  return chessApi.get<PageResponse<Game>>(`/players/games/${playerId}?${args.join('&')}`);
};

const getPlayerStats = (playerId: number) =>
  chessApi.get<PlayerStatInfo>(`/players/stats/${playerId}`);

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

const getAllGameData = (id: number) => chessApi.get<AllGameData>(`games/${id}`);

const authenticatePlayer = (playerInfo: AdditionalPlayerInfo) =>
  chessApi.post<Player>('players/auth', playerInfo);

const changeName = (newName: string) => chessApi.post<Player>('players/name', { name: newName });

const joinGame = (gameId: number, color: PieceColor) =>
  chessApi.post<Game>(`players/join/${gameId}?color=${color}`);

const leaveGame = (gameId: number) => chessApi.post<Game>(`players/leave/${gameId}`);

const resignGame = (gameId: number) => chessApi.post<Game>(`players/resign/${gameId}`);

export default {
  getGames,
  getPlayerGames,
  getPlayerStats,
  getPieces,
  getMoves,
  createGame,
  getAllGameData,
  promote,
  move,
  authenticatePlayer,
  changeName,
  joinGame,
  leaveGame,
  resignGame
};
