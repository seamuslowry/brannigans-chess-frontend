import { Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, RouteProps } from 'react-router-dom';
import { AppState } from '../../store/store';

const PrivateRoute: React.FC<RouteProps> = props => {
  const loggedIn = useSelector<AppState, boolean>(state => !!state.auth.token);

  return loggedIn ? <Route {...props} /> : <Typography>Not available until after login</Typography>;
};

export default PrivateRoute;
