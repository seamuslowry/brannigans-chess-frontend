import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import GamesList from './games/GamesList/GamesList';

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
            <Route path="/">
              <GamesList />
            </Route>
            <Redirect to="/" />
          </Switch>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
