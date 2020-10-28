import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import config from '../../config';
import { GoogleLoginRequired, logout } from '../../store/auth/auth';
import { sendAlert } from '../../store/notifications/notifications';
import { googleSignup, googleLogin } from '../../store/auth/auth.thunk';
import {
  AuthenticationVariant,
  LoginOptionProps
} from '../AuthenticationDialog/AuthenticationDialog';

type VariantValues = {
  [key in AuthenticationVariant]: {
    action: typeof googleLogin | typeof googleSignup;
  };
};

const variants: VariantValues = {
  login: {
    action: googleLogin
  },
  signup: {
    action: googleSignup
  }
};

const AuthenticateWithGoogle: React.FC<LoginOptionProps & Omit<ButtonProps, 'onClick'>> = ({
  authVariant,
  ...props
}) => {
  const dispatch = useDispatch();
  const { action } = variants[authVariant];

  const onSuccess = (data: GoogleLoginRequired | GoogleLoginResponseOffline) => {
    console.log(data); // with Authorization Code flow ('code' and 'offline', only has a `code` property that should be sent to the server)
    if ('code' in data) {
      // new check for offline
      console.log(data.code);
    }
    if ('profileObj' in data) {
      // shouldn't use this anymore probably
      dispatch(action(data));
    } else {
      dispatch(sendAlert('Login Failed'));
    }
  };
  const onFailure = () => {
    dispatch(logout());
  };

  const { signIn, loaded } = useGoogleLogin({
    clientId: config.clientId,
    responseType: 'code',
    accessType: 'offline',
    onSuccess,
    onFailure,
    isSignedIn: authVariant === 'login'
  });

  return (
    <Button {...props} onClick={signIn} disabled={!loaded}>
      Continue with Google
    </Button>
  );
};

export default AuthenticateWithGoogle;
