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

export const GAME_STATUS_PREFIX = `/game/status/`;
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

export const resignGame = createAsyncThunk('chess/games/resignGame', async (gameId: number) => {
  try {
    const response = await ChessService.resignGame(gameId);
    return response.data;
  } catch (e) {
    if (e.response?.status === 409) {
      throw new Error(e.response.data);
    } else {
      throw e;
    }
  }
});

export const getAllGameData = createAsyncThunk('chess/games/getAllData', async (gameId: number) => {
  const response = await ChessService.getAllGameData(gameId);
  return response.data;
});

const gamesAdapter = createEntityAdapter<Game>();

export const initialState = gamesAdapter.getInitialState();
export type GameState = typeof initialState;

const gameSlice = createSlice({
  name: 'chess/games',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // do not need a case for join because the status topic will update the game info
    // do not need a case for leave because the status topic will update the game info
    builder.addCase(createGame.fulfilled, gamesAdapter.upsertOne).addMatcher(
      (action: AnyAction): action is StompMessage =>
        action.type === STOMP_MESSAGE && action.payload.topic.includes(GAME_STATUS_PREFIX),
      (state, action) => {
        const game: Game = JSON.parse(action.payload.data);
        state = gamesAdapter.upsertOne(state, game);
      }
    );
  }
});

export const { selectById: selectGameById, selectAll: selectGames } = gamesAdapter.getSelectors();

export const selectWhiteId = createSelector(selectGameById, game => game?.whitePlayer?.authId);
export const selectBlackId = createSelector(selectGameById, game => game?.blackPlayer?.authId);
export const selectGameStatus = createSelector(selectGameById, game => game?.status);

export default gameSlice.reducer;
