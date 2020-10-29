import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC<Omit<ButtonProps, 'onClick' | 'disabled'>> = props => {
  const { loginWithPopup, user, isLoading } = useAuth0();

  return (
    <Button {...props} disabled={isLoading} onClick={loginWithPopup}>
      Login
    </Button>
  );
};

export default Login;
