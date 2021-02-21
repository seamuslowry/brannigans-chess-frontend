import { useAuth0 } from '@auth0/auth0-react';
import { Button, ButtonProps } from '@material-ui/core';
import React from 'react';

const Logout: React.FC<Omit<ButtonProps, 'onClick' | 'disabled'>> = props => {
  const { logout, isLoading } = useAuth0();

  return (
    <Button
      {...props}
      disabled={isLoading}
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Logout
    </Button>
  );
};

export default Logout;
