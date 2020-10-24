import { Button, ButtonProps } from '@material-ui/core';
import React from 'react';
import { useGoogleLogout } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import config from '../../config';
import { logout } from '../../store/auth/auth';
import { sendAlert } from '../../store/notifications/notifications';

const Logout: React.FC<Omit<ButtonProps, 'onClick'>> = props => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSuccess = () => {
    dispatch(logout());
    history.push('/');
  };

  const onFailure = () => {
    dispatch(sendAlert('Logout failed. Try Again.'));
  };

  const { signOut } = useGoogleLogout({
    clientId: config.clientId,
    onLogoutSuccess: onSuccess,
    onFailure
  });

  return (
    <Button {...props} onClick={signOut}>
      Logout
    </Button>
  );
};

export default Logout;
