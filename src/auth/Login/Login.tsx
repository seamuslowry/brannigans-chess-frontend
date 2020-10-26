import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import config from '../../config';
import { GoogleLoginRequired, logout } from '../../store/auth/auth';
import { sendAlert } from '../../store/notifications/notifications';
import { login } from '../../store/auth/auth.thunk';
import AuthDialog from '../AuthDialog/AuthDialog';

const Login: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button {...props} onClick={() => setOpen(true)}>
        Login
      </Button>
      <AuthDialog open={open} onClose={() => setOpen(false)} variant="login" />
    </>
  );
};

export default Login;
