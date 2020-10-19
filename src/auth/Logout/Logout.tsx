import { Button, ButtonProps } from '@material-ui/core';
import React from 'react';
import { useGoogleLogout } from 'react-google-login';
import { useDispatch } from 'react-redux';
import config from '../../config';
import { logout } from '../../store/auth/auth';

const Logout: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  const dispatch = useDispatch();

  const onSuccess = () => {
    dispatch(logout());
  };
  const { signOut } = useGoogleLogout({
    clientId: config.clientId,
    onLogoutSuccess: onSuccess
  });

  return (
    <Button {...props} onClick={signOut}>
      Logout
    </Button>
  );
};

export default Logout;
