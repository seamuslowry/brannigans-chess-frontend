import { Player } from '../../services/ChessService.types';

export const UPDATE_TOKEN = 'chess/auth/UPDATE_TOKEN';
export const UPDATE_PLAYER = 'chess/auth/UPDATE_PLAYER';

export interface AuthState {
  player?: Player;
  token?: string;
}

export const initialState: AuthState = {};

interface UpdatePlayer {
  type: typeof UPDATE_PLAYER;
  payload: Player;
}

interface UpdateToken {
  type: typeof UPDATE_TOKEN;
  payload: string;
}

type AuthAction = UpdateToken | UpdatePlayer;

export const reducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case UPDATE_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case UPDATE_PLAYER:
      return {
        ...state,
        player: action.payload
      };
    default:
      return state;
  }
};

export const updateToken = (payload: string): UpdateToken => ({
  type: UPDATE_TOKEN,
  payload
});

export const updatePlayer = (payload: Player): UpdatePlayer => ({
  type: UPDATE_PLAYER,
  payload
});
