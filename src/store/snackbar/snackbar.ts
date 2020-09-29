import { Color } from '@material-ui/lab';

export const SEND_ALERT = 'chess/snackbar/SEND_ALERT';
export const REMOVE_ALERT = 'chess/snackbar/REMOVE_ALERT';

export interface AlertInfo {
  message: string;
  severity: Color;
}

export interface SnackbarState {
  alerts: AlertInfo[];
}

export const initialState: SnackbarState = {
  alerts: []
};

interface SendAlert {
  type: typeof SEND_ALERT;
  payload: AlertInfo;
}

interface RemoveAlert {
  type: typeof REMOVE_ALERT;
  payload: AlertInfo;
}

type SnackbarAction = SendAlert | RemoveAlert;

export const reducer = (
  state: SnackbarState = initialState,
  action: SnackbarAction
): SnackbarState => {
  switch (action.type) {
    case SEND_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload]
      };
    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(
          a => !(a.message === action.payload.message && a.severity === action.payload.severity)
        )
      };
    default:
      return initialState;
  }
};

export const sendAlert = (message: string, severity: Color = 'error'): SendAlert => ({
  type: SEND_ALERT,
  payload: {
    message,
    severity
  }
});

export const removeAlert = (alert: AlertInfo): RemoveAlert => ({
  type: REMOVE_ALERT,
  payload: alert
});
