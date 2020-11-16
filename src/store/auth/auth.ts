import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import { AdditionalPlayerInfo, Player } from '../../services/ChessService.types';

interface AuthenticatePlayerParams {
  playerInfo: AdditionalPlayerInfo;
  getAccessToken: () => Promise<string>;
}

export const authenticatePlayer = createAsyncThunk(
  'chess/auth/authenticatePlayer',
  async (params: AuthenticatePlayerParams) => {
    const token = await params.getAccessToken();
    localStorage.setItem('token', token);

    const response = await ChessService.authenticatePlayer(params.playerInfo);
    return response.data;
  }
);

export const updateDisplayName = createAsyncThunk(
  'chess/auth/updateDisplayName',
  async (name: string) => {
    const response = await ChessService.changeName(name);
    return response.data;
  }
);

export interface AuthState {
  player?: Player;
}

export const initialState: AuthState = {};

const sharedClearAuth = () => {
  localStorage.removeItem('token');
  return initialState;
};

const authSlice = createSlice({
  name: 'chess/auth',
  initialState,
  reducers: {
    clearAuth: sharedClearAuth
  },
  extraReducers: builder => {
    builder
      .addCase(authenticatePlayer.fulfilled, (state, action) => {
        state.player = action.payload;
      })
      .addCase(updateDisplayName.fulfilled, (state, action) => {
        state.player = action.payload;
      })
      .addCase(authenticatePlayer.rejected, sharedClearAuth);
  }
});

export const { clearAuth } = authSlice.actions;

export default authSlice.reducer;
