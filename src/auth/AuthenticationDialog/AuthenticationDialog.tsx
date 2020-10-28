import React from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme
} from '@material-ui/core';
import AuthenticateWithGoogle from '../AuthenticateWithGoogle/AuthenticateWithGoogle';
import { Close } from '@material-ui/icons';

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
  const theme = useTheme();

  return (
    <Dialog onClose={onClose} open={open} maxWidth="xs" fullWidth>
      <DialogTitle disableTypography>
        <Typography variant="h6">{title}</Typography>
        <Box position="absolute" right={theme.spacing(1)} top={theme.spacing(1)}>
          <IconButton aria-label="close" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" pb={2}>
          <AuthenticateWithGoogle authVariant={variant} fullWidth />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuthenticationDialog;
