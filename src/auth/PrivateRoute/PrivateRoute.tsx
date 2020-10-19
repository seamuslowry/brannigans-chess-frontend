import React from 'react';
import { useSelector } from 'react-redux';
import { Route, RouteProps } from 'react-router-dom';
import { AppState } from '../../store/store';

const PrivateRoute: React.FC<RouteProps> = props => {
  const token = useSelector<AppState, string | undefined>(state => state.auth.token);

  return token ? <Route {...props} /> : null;
};

export default PrivateRoute;
