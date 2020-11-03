import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from '../../services/ChessService.types';

export interface AuthState {
  player?: Player;
  token?: string;
}

export const initialState: AuthState = {};

const authSlice = createSlice({
  name: 'chess/auth',
  initialState,
  reducers: {
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    updatePlayer: (state, action: PayloadAction<Player>) => {
      state.player = action.payload;
    }
  }
});

export const { updatePlayer, updateToken } = authSlice.actions;

export default authSlice.reducer;
