import { chessApi } from './Api';

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

export interface PageRequest {
  page: number;
  size: number;
  orderBy: string;
  order: 'asc' | 'desc';
}

const getGames = (active?: boolean, pageRequest: Partial<PageRequest> = {}) => {
  const { page, size, order, orderBy } = pageRequest;

  const args = [];

  active !== undefined && args.push(`active=${active}`);

  page && args.push(`page=${page}`);
  size && args.push(`size=${size}`);
  order && args.push(`active=${order}`);
  orderBy && args.push(`orderBy=${orderBy}`);

  return chessApi.get<Game[]>(`/games?${args.join('&')}`);
};

export default {
  getGames
};
