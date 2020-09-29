import { Color } from '@material-ui/lab';

export const SEND_ALERT = 'chess/notifications/SEND_ALERT';
export const REMOVE_ALERT = 'chess/notifications/REMOVE_ALERT';

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

interface SendAlert {
  type: typeof SEND_ALERT;
  payload: AlertInfo;
}

interface RemoveAlert {
  type: typeof REMOVE_ALERT;
  payload: AlertInfo;
}

type NotificationsAction = SendAlert | RemoveAlert;

export const reducer = (
  state: NotificationsState = initialState,
  action: NotificationsAction
): NotificationsState => {
  switch (action.type) {
    case SEND_ALERT:
      return {
        ...state,
        pendingAlerts: [...state.pendingAlerts, action.payload]
      };
    case REMOVE_ALERT:
      return {
        ...state,
        pendingAlerts: state.pendingAlerts.filter(
          a => !(a.message === action.payload.message && a.severity === action.payload.severity)
        )
      };
    default:
      return state;
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
