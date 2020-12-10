import { Color } from '@material-ui/lab';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authenticatePlayer, updateDisplayName } from '../auth/auth';
import { dragMove } from '../boards/boards';
import { createGame, getAllGameData, joinGame, leaveGame } from '../games/games';
import { getMoves } from '../moves/moves';
import { getPieces, promotePawn } from '../pieces/pieces';

export interface AlertInfo {
  message: string;
  severity: Color;
}

export interface NotificationsState {
  pendingAlerts: AlertInfo[];
}

export const initialState: NotificationsState = {
  pendingAlerts: []
};

const prepareAlertInfo = (message: string, severity: Color = 'error') => ({
  payload: { message, severity }
});

const notificationsSlice = createSlice({
  name: 'chess/notifications',
  initialState,
  reducers: {
    removeAlert: {
      reducer: (state, action: PayloadAction<AlertInfo>) => {
        state.pendingAlerts = state.pendingAlerts.filter(
          a => !(a.message === action.payload.message && a.severity === action.payload.severity)
        );
      },
      prepare: prepareAlertInfo
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getPieces.rejected, (state, action) => {
        const { colors, status = '' } = action.meta.arg;

        const metadataString = ` ${colors.join(' and ')} ${status}`.trimEnd();

        state.pendingAlerts.push({
          message: `Could not find${metadataString} pieces: ${action.error.message}`,
          severity: 'error'
        });
      })
      .addCase(getMoves.rejected, (state, action) => {
        const { colors } = action.meta.arg;

        const metadataString = ` ${colors.join(' and ')}`.trimEnd();

        state.pendingAlerts.push({
          message: `Could not find${metadataString} moves: ${action.error.message}`,
          severity: 'error'
        });
      })
      .addCase(createGame.rejected, (state, action) => {
        state.pendingAlerts.push({
          message: `Could not create game: ${action.error.message}`,
          severity: 'error'
        });
      })
      .addCase(getAllGameData.rejected, (state, action) => {
        state.pendingAlerts.push({
          message: `Could not retrieve specator data: ${action.error.message}`,
          severity: 'error'
        });
      })
      .addCase(promotePawn.rejected, (state, action) => {
        state.pendingAlerts.push({
          message: `Failed to promote the piece: ${action.error.message}`,
          severity: 'error'
        });
      })
      .addCase(joinGame.rejected, (state, action) => {
        state.pendingAlerts.push({
          message: `Could not join game: ${action.error.message}`,
          severity: 'error'
        });
      })
      .addCase(leaveGame.rejected, (state, action) => {
        state.pendingAlerts.push({
          message: `Could not leave game: ${action.error.message}`,
          severity: 'error'
        });
      })
      .addCase(authenticatePlayer.rejected, (state, action) => {
        state.pendingAlerts.push({
          message: `Error finding Player: ${action.error.message}`,
          severity: 'error'
        });
      })
      .addCase(updateDisplayName.rejected, (state, action) => {
        state.pendingAlerts.push({
          message: `Error updating name: ${action.error.message}`,
          severity: 'error'
        });
      })
      .addCase(dragMove.rejected, (state, action) => {
        state.pendingAlerts.push({
          message: `${action.error.message}`,
          severity: 'error'
        });
      });
  }
});

export const { removeAlert } = notificationsSlice.actions;

export default notificationsSlice.reducer;
