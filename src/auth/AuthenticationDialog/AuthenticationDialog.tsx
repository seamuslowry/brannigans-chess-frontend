import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import AuthenticateWithGoogle from '../AuthenticateWithGoogle/AuthenticateWithGoogle';

export interface LoginOptionProps {
  authVariant: AuthenticationVariant;
}

export type AuthenticationVariant = 'login' | 'signup';

type VariantValues = {
  [key in AuthenticationVariant]: { title: string };
};

const variants: VariantValues = {
  login: { title: 'Login' },
  signup: { title: 'Signup' }
};

interface Props {
  variant: AuthenticationVariant;
  open: boolean;
  onClose: VoidFunction;
}

const AuthenticationDialog: React.FC<Props> = ({ variant, open, onClose }) => {
  const { title } = variants[variant];

  return (
    <Dialog keepMounted onClose={onClose} open={open} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" pb={2}>
          <AuthenticateWithGoogle authVariant={variant} fullWidth />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthenticationDialog;
