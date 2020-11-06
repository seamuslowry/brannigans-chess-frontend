import { Color } from '@material-ui/lab';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPieces, clickTile } from '../activeGame/activeGame';

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
    sendAlert: {
      reducer: (state, action: PayloadAction<AlertInfo>) => {
        state.pendingAlerts.push(action.payload);
      },
      prepare: prepareAlertInfo
    },
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
    builder.addCase(getPieces.rejected, (state, action) => {
      const { color = '', status = '' } = action.meta.arg;

      const metadataString = ` ${color} ${status}`.trimEnd();

      state.pendingAlerts.push({
        message: `Could not find${metadataString} pieces: ${action.error.message}`,
        severity: 'error'
      });
    });
    builder.addCase(clickTile.rejected, (state, action) => {
      state.pendingAlerts.push({
        message: `${action.error.message}`,
        severity: 'error'
      });
    });
  }
});

export const { sendAlert, removeAlert } = notificationsSlice.actions;

export default notificationsSlice.reducer;
