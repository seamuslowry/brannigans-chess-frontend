import { Box } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from './atoms/PrivateRoute/PrivateRoute';
import Attributions from './molecules/Attributions/Attributions';
import Notifications from './organisms/Notifications/Notifications';
import PlayerLoading from './organisms/PlayerLoading/PlayerLoading';
import NavBar from './organisms/NavBar/NavBar';
import ActiveGame from './pages/ActiveGame/ActiveGame';
import Faqs from './pages/Faqs/Faqs';
import Profile from './pages/Profile/Profile';
import ViewGames from './pages/ViewGames/ViewGames';

const App = () => {
  return (
    <Router>
      <PlayerLoading />
      <NavBar />
      <Box m={1}>
        <Box pt={2} display="flex" justifyContent="center">
          <Switch>
            <PrivateRoute path="/game/:uuid">
              <ActiveGame />
            </PrivateRoute>
            <PrivateRoute path="/user">
              <Profile />
            </PrivateRoute>
            <Route path="/faq">
              <Faqs />
            </Route>
            <Route exact path="/">
              <ViewGames />
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
