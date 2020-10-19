import { Box } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute/PrivateRoute';
import ActiveGame from './games/ActiveGame/ActiveGame';
import GamesList from './games/GamesList/GamesList';
import Attributions from './information/Attributions/Attributions';
import Faqs from './information/Faqs/Faqs';
import NavBar from './information/NavBar/NavBar';
import Notifications from './notifications/Notifications/Notifications';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Box m={1}>
        <Box pt={2} display="flex" justifyContent="center">
          <Switch>
            <Route path="/faq">
              <Faqs />
            </Route>
            <PrivateRoute path="/game/:id">
              <ActiveGame />
            </PrivateRoute>
            <PrivateRoute exact path="/">
              <GamesList />
            </PrivateRoute>
            <Redirect to="/" />
          </Switch>
        </Box>
        <Notifications />
        <Attributions />
      </Box>
    </Router>
  );
};

export default App;
