import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import AuthenticationDialog from '../AuthenticationDialog/AuthenticationDialog';

const Login: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button {...props} onClick={() => setOpen(true)}>
        Login
      </Button>
      <AuthenticationDialog open={open} onClose={() => setOpen(false)} variant="login" />
    </>
  );
};

export default Login;
