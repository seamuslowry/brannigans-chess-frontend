import { AnyAction, applyMiddleware, combineReducers, createStore } from 'redux';
import thunk, { ThunkAction, ThunkMiddleware } from 'redux-thunk';
import { reducer as activeGameReducer, ActiveGameState } from './activeGame/activeGame';

export type ThunkResult<R> = ThunkAction<R, AppState, undefined, AnyAction>;

export interface AppState {
  activeGame: ActiveGameState;
}

const rootReducer = combineReducers<AppState>({
  activeGame: activeGameReducer
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk as ThunkMiddleware<AppState, AnyAction>)
);
