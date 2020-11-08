import {
  AnyAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import { Game, PieceColor } from '../../services/ChessService.types';
import { StompMessage, STOMP_MESSAGE } from '../middleware/stomp/stomp';

const GAME_STATUS_PREFIX = `/game/status/`;
export const getStatusTopic = (gameId: number) => `${GAME_STATUS_PREFIX}${gameId}`;

export const createGame = createAsyncThunk('chess/games/createGame', async () => {
  const response = await ChessService.createGame();
  return response.data;
});

interface JoinGameParams {
  gameId: number;
  pieceColor: PieceColor;
}

export const joinGame = createAsyncThunk(
  'chess/games/joinGame',
  async ({ gameId, pieceColor }: JoinGameParams) => {
    try {
      const response = await ChessService.joinGame(gameId, pieceColor);
      return response.data;
    } catch (e) {
      if (e.response?.status === 409) {
        throw new Error(e.response.data);
      } else {
        throw e;
      }
    }
  }
);

export const leaveGame = createAsyncThunk('chess/games/leaveGame', async (gameId: number) => {
  try {
    const response = await ChessService.leaveGame(gameId);
    return response.data;
  } catch (e) {
    if (e.response?.status === 409) {
      throw new Error(e.response.data);
    } else {
      throw e;
    }
  }
});

interface GetGamesParams {
  active: boolean;
  page: number;
}

const PAGE_SIZE = 10;
const PAGE_SORT_BY = 'id';
const PAGE_ORDER = 'desc';

export const getGames = createAsyncThunk(
  'chess/games/getGames',
  async ({ active, page }: GetGamesParams) => {
    const response = await ChessService.getGames(active, {
      page: page - 1,
      size: PAGE_SIZE,
      order: PAGE_ORDER,
      orderBy: PAGE_SORT_BY
    });
    return response.data;
  }
);

const gamesAdapter = createEntityAdapter<Game>({
  sortComparer: (a, b) => b.id - a.id // sort games asc
});

export const initialState = gamesAdapter.getInitialState();
export type GameState = typeof initialState;

const gameSlice = createSlice({
  name: 'chess/games',
  initialState,
  reducers: {
    addGames: gamesAdapter.upsertMany
  },
  extraReducers: builder => {
    // do not need a case for join because the status topic will update the game info
    // do not need a case for leave because the status topic will update the game info
    builder
      .addCase(createGame.fulfilled, gamesAdapter.upsertOne)
      .addCase(getGames.fulfilled, (state, action) => {
        state = gamesAdapter.upsertMany(state, action.payload.content);
      })
      .addMatcher(
        (action: AnyAction): action is StompMessage => action.type === STOMP_MESSAGE,
        (state, action) => {
          if (action.payload.topic.includes(GAME_STATUS_PREFIX)) {
            const game: Game = JSON.parse(action.payload.data);
            state = gamesAdapter.upsertOne(state, game);
          }
        }
      );
  }
});

export const { addGames } = gameSlice.actions;

export const { selectById: selectGameById, selectAll: selectGames } = gamesAdapter.getSelectors();

export const selectWhiteId = createSelector(selectGameById, game => game?.whitePlayer?.authId);
export const selectBlackId = createSelector(selectGameById, game => game?.blackPlayer?.authId);

export const selectPage = createSelector(
  selectGames,
  (_: GameState, page: number) => page,
  (games, page) => games.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
);

export default gameSlice.reducer;
