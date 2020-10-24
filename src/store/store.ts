import { AnyAction, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk, { ThunkAction, ThunkMiddleware } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducer as activeGameReducer, ActiveGameState } from './activeGame/activeGame';
import { reducer as notificationsReducer, NotificationsState } from './notifications/notifications';
import { reducer as socketReducer, SocketState } from './socket/socket';
import { reducer as authReducer, AuthState } from './auth/auth';
import createStompMiddleware from './middleware/stomp/stomp';
import config from '../config';

export type ThunkResult<R> = ThunkAction<R, AppState, undefined, AnyAction>;

export interface AppState {
  activeGame: ActiveGameState;
  auth: AuthState;
  notifications: NotificationsState;
  socket: SocketState;
}

const rootReducer = combineReducers<AppState>({
  activeGame: activeGameReducer,
  auth: authReducer,
  notifications: notificationsReducer,
  socket: socketReducer
});

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      thunk as ThunkMiddleware<AppState, AnyAction>,
      createStompMiddleware(`${config.serviceUrl}/ws`)
    )
  )
);
