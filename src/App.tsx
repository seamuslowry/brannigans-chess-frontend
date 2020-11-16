import { Box } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from './auth/PrivateRoute/PrivateRoute';
import ActiveGame from './organisms/ActiveGame/ActiveGame';
import GamesList from './games/GamesList/GamesList';
import Attributions from './molecules/Attributions/Attributions';
import Faqs from './organisms/Faqs/Faqs';
import NavBar from './molecules/NavBar/NavBar';
import Notifications from './organisms/Notifications/Notifications';
import Profile from './user/Profile/Profile';
import PlayerLoading from './organisms/PlayerLoading/PlayerLoading';

const App = () => {
  return (
    <Router>
      <PlayerLoading />
      <NavBar />
      <Box m={1}>
        <Box pt={2} display="flex" justifyContent="center">
          <Switch>
            <PrivateRoute path="/game/:id">
              <ActiveGame />
            </PrivateRoute>
            <PrivateRoute path="/user">
              <Profile />
            </PrivateRoute>
            <Route path="/faq">
              <Faqs />
            </Route>
            <Route exact path="/">
              <GamesList />
            </Route>
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
