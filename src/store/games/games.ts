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

const gamesAdapter = createEntityAdapter<Game>();

export const initialState = gamesAdapter.getInitialState();
export type GameState = typeof initialState;

const gameSlice = createSlice({
  name: 'chess/games',
  initialState,
  reducers: {},
  extraReducers: builder => {
    // do not need a case for join because the status topic will update the game info
    builder.addCase(createGame.fulfilled, gamesAdapter.upsertOne).addMatcher(
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

export const { selectById: selectGameById } = gamesAdapter.getSelectors();

export const selectWhiteId = createSelector(selectGameById, game => game?.whitePlayer?.authId);
export const selectBlackId = createSelector(selectGameById, game => game?.blackPlayer?.authId);

export default gameSlice.reducer;
