import React from 'react';
import { ButtonProps } from '@material-ui/core';
import AuthenticateWithGoogle from '../AuthenticateWithGoogle/AuthenticateWithGoogle';

const Signup: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  return (
    <AuthenticateWithGoogle {...props} authVariant="signup">
      Signup
    </AuthenticateWithGoogle>
  );
};

export default Signup;
