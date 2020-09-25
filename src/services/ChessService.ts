import { chessApi } from './api';

export interface Game {
    uuid: string;
}

const getGames = (active?: boolean) => chessApi.get<Game[]>(`/games?${active !== undefined ? `active=${active}`: ''}`)

export default {
    getGames
}