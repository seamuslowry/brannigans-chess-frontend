import { AxiosResponse } from 'axios';
import ChessService from '../../services/ChessService';
import { Player } from '../../services/ChessService.types';
import { sendAlert } from '../notifications/notifications';
import { ThunkResult } from '../store';
import { loginOnce, GoogleLoginRequired, logout, updatePlayer } from './auth';

export const googleLogin = (payload: GoogleLoginRequired): ThunkResult<void> => dispatch => {
  return dispatch(authenticate(payload, ChessService.loginWithGoogle));
};

export const googleSignup = (
  payload: GoogleLoginRequired
): ThunkResult<Promise<void>> => async dispatch => {
  return dispatch(authenticate(payload, ChessService.signupWithGoogle));
};

const authenticate = (
  payload: GoogleLoginRequired,
  serverCheck: () => Promise<AxiosResponse<Player>>
): ThunkResult<Promise<void>> => async dispatch => {
  let refreshTiming = (payload.tokenObj.expires_in - 5 * 60) * 1000;

  const refreshToken = async () => {
    // const newAuthRes = await payload.reloadAuthResponse();
    // refreshTiming = (newAuthRes.expires_in - 5 * 60) * 1000;
    // const newTimeout = setTimeout(refreshToken, refreshTiming);
    // dispatch(updateToken(newAuthRes.id_token));
  };

  const initialTimeout = setTimeout(refreshToken, refreshTiming);

  dispatch(loginOnce(payload, initialTimeout));
  return serverCheck()
    .then(res => {
      dispatch(updatePlayer(res.data));
    })
    .catch(e => {
      dispatch(logout());
      dispatch(sendAlert(`Error: ${e.response.data}`));
    });
};
