import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin
} from 'react-google-login';
import { useDispatch } from 'react-redux';
import config from '../../config';
import { login, logout } from '../../store/auth/auth';
import { sendAlert } from '../../store/notifications/notifications';

const Login: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  const dispatch = useDispatch();

  const onSuccess = (data: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('profileObj' in data) {
      // TODO add refresh token handler
      dispatch(login(data));
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
    isSignedIn: true
  });

  return (
    <Button {...props} onClick={signIn}>
      Login
    </Button>
  );
};

export default Login;
