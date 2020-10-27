import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
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
