import React from 'react';
import { Box, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import AuthenticateWithGoogle from '../AuthenticateWithGoogle/AuthenticateWithGoogle';

export interface LoginOptionProps {
  authVariant: AuthVariant;
  onAuthenticationSuccess: () => void;
}

export type AuthVariant = 'login' | 'signup';

type VariantValues = {
  [key in AuthVariant]: { title: string };
};

const variants: VariantValues = {
  login: { title: 'Login' },
  signup: { title: 'Signup' }
};

interface Props {
  variant: AuthVariant;
  open: boolean;
  onClose: VoidFunction;
}

const AuthDialog: React.FC<Props> = ({ variant, open, onClose }) => {
  const { title } = variants[variant];

  return (
    <Dialog onClose={onClose} open={open} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" pb={2}>
          <AuthenticateWithGoogle
            authVariant={variant}
            fullWidth
            onAuthenticationSuccess={onClose}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
