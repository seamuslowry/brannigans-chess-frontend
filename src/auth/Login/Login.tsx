import React from 'react';
import { ButtonProps } from '@material-ui/core';
import AuthenticateWithGoogle from '../AuthenticateWithGoogle/AuthenticateWithGoogle';

const Login: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  return (
    <AuthenticateWithGoogle {...props} authVariant="login">
      Login
    </AuthenticateWithGoogle>
  );
};

export default Login;
