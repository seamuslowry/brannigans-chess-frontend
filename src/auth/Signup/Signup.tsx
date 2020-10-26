import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import AuthDialog from '../AuthDialog/AuthDialog';

const Signup: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button {...props} onClick={() => setOpen(true)}>
        Signup
      </Button>
      <AuthDialog open={open} onClose={() => setOpen(false)} variant="signup" />
    </>
  );
};

export default Signup;
