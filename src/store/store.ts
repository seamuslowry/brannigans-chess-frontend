import { combineReducers, createStore } from 'redux';
import { reducer as activeGameReducer, ActiveGameState } from './activeGame/activeGame';

export interface AppState {
  activeGame: ActiveGameState;
}

const rootReducer = combineReducers<AppState>({
  activeGame: activeGameReducer
});

export const store = createStore(rootReducer);
