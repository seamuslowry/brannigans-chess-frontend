import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import config from '../../config';
import { GoogleLoginRequired, logout } from '../../store/auth/auth';
import { sendAlert } from '../../store/notifications/notifications';
import { login } from '../../store/auth/auth.thunk';

const Login: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  const dispatch = useDispatch();

  const onSuccess = (data: GoogleLoginRequired | GoogleLoginResponseOffline) => {
    if ('profileObj' in data) {
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
