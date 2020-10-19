import { GoogleLoginResponse } from 'react-google-login';

export const LOGIN = 'chess/auth/LOGIN';
export const LOGOUT = 'chess/auth/LOGOUT';

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
  payload: GoogleLoginResponse;
}

interface Logout {
  type: typeof LOGOUT;
}

type AuthAction = Login | Logout;

export const reducer = (state: AuthState = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: {
          ...action.payload.profileObj
        },
        token: action.payload.tokenObj.id_token
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export const login = (payload: GoogleLoginResponse): Login => ({
  type: LOGIN,
  payload
});

export const logout = (): Logout => ({
  type: LOGOUT
});
