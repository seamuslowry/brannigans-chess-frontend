import { Box } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ActiveGame from './games/ActiveGame/ActiveGame';
import GamesList from './games/GamesList/GamesList';
import Attributions from './information/Attributions/Attributions';
import NavBar from './information/NavBar/NavBar';
import Notifications from './notifications/Notifications/Notifications';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Box m={1}>
        <Box pt={2} display="flex" justifyContent="center">
          <Switch>
            <Route path="/game/:id">
              <ActiveGame />
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
