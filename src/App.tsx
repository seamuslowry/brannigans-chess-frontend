import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ActiveGame from './games/ActiveGame/ActiveGame';
import GamesList from './games/GamesList/GamesList';
import Attributions from './information/CreateGameButton/Attributions';
import Notifications from './notifications/Notifications/Notifications';

const App = () => {
  return (
    <Router>
      <Box m={1}>
        <Box>
          <Typography align="center">
            In the game of chess, you can never let your adversary see your pieces.
          </Typography>
          <Typography align="center">-Zapp Brannigan</Typography>
        </Box>
        <Box pt={2} display="flex" justifyContent="center">
          <Switch>
            <Route path="/game/:id">
              <ActiveGame />
            </Route>
            <Route path="/">
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
