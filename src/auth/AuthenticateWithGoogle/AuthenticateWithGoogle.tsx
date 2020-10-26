import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { AxiosError, AxiosResponse } from 'axios';
import { GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import config from '../../config';
import { GoogleLoginRequired, logout, updatePlayer } from '../../store/auth/auth';
import { sendAlert } from '../../store/notifications/notifications';
import { login } from '../../store/auth/auth.thunk';
import { AuthVariant, LoginOptionProps } from '../AuthDialog/AuthDialog';
import { Player } from '../../services/ChessService.types';
import ChessService from '../../services/ChessService';

type VariantValues = {
  [key in AuthVariant]: {
    serverCheck: () => Promise<AxiosResponse<Player>>;
  };
};

const variants: VariantValues = {
  login: {
    serverCheck: ChessService.loginWithGoogle
  },
  signup: {
    serverCheck: ChessService.signupWithGoogle
  }
};

const AuthenticateWithGoogle: React.FC<LoginOptionProps & Omit<ButtonProps, 'onClick'>> = ({
  authVariant,
  onAuthenticationSuccess,
  ...props
}) => {
  const dispatch = useDispatch();
  const { serverCheck } = variants[authVariant];

  const onSuccess = (data: GoogleLoginRequired | GoogleLoginResponseOffline) => {
    if ('profileObj' in data) {
      dispatch(login(data));
      serverCheck()
        .then(res => {
          dispatch(updatePlayer(res.data));
          onAuthenticationSuccess();
        })
        .catch(e => {
          console.log(e.response);
          dispatch(logout());
          dispatch(sendAlert(`Error: ${e.response.data}`));
        });
    } else {
      dispatch(sendAlert('Login Failed'));
    }
  };
  const onFailure = () => {
    dispatch(logout());
  };

  const { signIn } = useGoogleLogin({
    clientId: config.clientId,
    onSuccess,
    onFailure,
    isSignedIn: authVariant === 'login'
  });

  return (
    <Button {...props} onClick={signIn}>
      Continue with Google
    </Button>
  );
};

export default AuthenticateWithGoogle;
