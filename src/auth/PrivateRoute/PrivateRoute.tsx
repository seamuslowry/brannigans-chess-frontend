import { useAuth0 } from '@auth0/auth0-react';
import { Typography } from '@material-ui/core';
import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

const PrivateRoute: React.FC<RouteProps> = props => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <Route {...props} />
  ) : (
    <Typography>Not available until after login</Typography>
  );
};

export default PrivateRoute;
