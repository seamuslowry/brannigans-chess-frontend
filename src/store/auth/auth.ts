import { GoogleLoginResponse } from 'react-google-login';

export const LOGIN = 'chess/auth/LOGIN';
export const UPDATE_TOKEN = 'chess/auth/UPDATE_TOKEN';
export const LOGOUT = 'chess/auth/LOGOUT';

export type GoogleLoginRequired = Pick<
  GoogleLoginResponse,
  'profileObj' | 'tokenObj' | 'reloadAuthResponse' | 'tokenId'
>;

export interface UserProfile {
  imageUrl: string;
  email: string;
  givenName: string;
}

export interface AuthState {
  user?: UserProfile;
  token?: string;
}

export const initialState: AuthState = {};

interface Login {
  type: typeof LOGIN;
  payload: GoogleLoginRequired;
}

interface UpdateToken {
  type: typeof UPDATE_TOKEN;
  payload: string;
}

interface Logout {
  type: typeof LOGOUT;
}

type AuthAction = Login | Logout | UpdateToken;

export const reducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: {
          ...action.payload.profileObj
        },
        token: action.payload.tokenId
      };
    case UPDATE_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export const loginOnce = (payload: GoogleLoginRequired): Login => ({
  type: LOGIN,
  payload
});

export const updateToken = (payload: string): UpdateToken => ({
  type: UPDATE_TOKEN,
  payload
});

export const logout = (): Logout => ({
  type: LOGOUT
});
