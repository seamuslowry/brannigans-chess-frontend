import { AnyAction, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk, { ThunkAction, ThunkMiddleware } from 'redux-thunk';
import { reducer as activeGameReducer, ActiveGameState } from './activeGame/activeGame';
import { reducer as notificationsReducer, NotificationsState } from './notifications/notifications';

export type ThunkResult<R> = ThunkAction<R, AppState, undefined, AnyAction>;

export interface AppState {
  activeGame: ActiveGameState;
  notifications: NotificationsState;
}

const rootReducer = combineReducers<AppState>({
  activeGame: activeGameReducer,
  notifications: notificationsReducer
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware<AppState, AnyAction>)
);
