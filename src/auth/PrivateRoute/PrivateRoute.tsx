import React from 'react';
import { Typography } from '@material-ui/core';
import { Route, RouteProps } from 'react-router-dom';
import useLoggedIn from '../../utils/useLoggedIn';

const PrivateRoute: React.FC<RouteProps> = props => {
  const loggedIn = useLoggedIn();

  return loggedIn ? <Route {...props} /> : <Typography>Not available until after login</Typography>;
};

export default PrivateRoute;
