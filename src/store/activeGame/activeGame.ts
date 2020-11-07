import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StompMessage, STOMP_MESSAGE } from '../middleware/stomp/stomp';
import { GameStatus, Player, Game } from '../../services/ChessService.types';

export const getStatusTopic = (gameId: number) => `/game/status/${gameId}`;
export const getSharedMovesTopic = (gameId: number) => `/game/moves/${gameId}`;

export interface ActiveGameState {
  status: GameStatus | '';
  whitePlayer: Player | null;
  blackPlayer: Player | null;
  id: number;
}

export const initialState: ActiveGameState = {
  status: '',
  whitePlayer: null,
  blackPlayer: null,
  id: 0
};

const activeGameSlice = createSlice({
  name: 'chess/activeGame',
  initialState,
  reducers: {
    setGameId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    clearGame: state => {
      state = initialState;
    }
  },
  extraReducers: builder => {
    builder.addMatcher(
      (action: AnyAction): action is StompMessage => action.type === STOMP_MESSAGE,
      (state, action) => {
        if (action.payload.topic === getStatusTopic(state.id)) {
          const game: Game = JSON.parse(action.payload.data);
          state.status = game.status;
          state.whitePlayer = game.whitePlayer;
          state.blackPlayer = game.blackPlayer;
        }
      }
    );
  }
});

export const { setGameId, clearGame } = activeGameSlice.actions;

export default activeGameSlice.reducer;
