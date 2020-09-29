import { AnyAction, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk, { ThunkAction, ThunkMiddleware } from 'redux-thunk';
import { reducer as activeGameReducer, ActiveGameState } from './activeGame/activeGame';
import { reducer as snackbarReducer, SnackbarState } from './snackbar/snackbar';

export type ThunkResult<R> = ThunkAction<R, AppState, undefined, AnyAction>;

export interface AppState {
  activeGame: ActiveGameState;
  snackbar: SnackbarState;
}

const rootReducer = combineReducers<AppState>({
  activeGame: activeGameReducer,
  snackbar: snackbarReducer
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware<AppState, AnyAction>)
);
