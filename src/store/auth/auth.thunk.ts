import { ThunkResult } from '../store';
import { loginOnce, updateToken, GoogleLoginRequired } from './auth';

export const login = (payload: GoogleLoginRequired): ThunkResult<void> => dispatch => {
  dispatch(loginOnce(payload));
  let refreshTiming = (payload.tokenObj.expires_in - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await payload.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in - 5 * 60) * 1000;
    dispatch(updateToken(newAuthRes.id_token));

    setTimeout(refreshToken, refreshTiming);
  };

  setTimeout(refreshToken, refreshTiming);
};
