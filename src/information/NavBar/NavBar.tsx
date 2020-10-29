import React from 'react';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GitHub } from '@material-ui/icons';
import Logout from '../../auth/Logout/Logout';
import Login from '../../auth/Login/Login';
import { useAuth0 } from '@auth0/auth0-react';
import { updatePlayer, updateToken } from '../../store/auth/auth';
import { AppState } from '../../store/store';
import { playerOne } from '../../utils/testData';

const NavBar: React.FC = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0(); // make new hook that checks for both player and isAuthenticated
  const accessToken = useSelector<AppState, string | undefined>(state => state.auth.token);

  const dispatch = useDispatch();

  const AuthButtonComponent = isAuthenticated ? Logout : Login;

  React.useEffect(() => {
    if (!isAuthenticated) return;
    const getToken = async () => {
      const token = await getAccessTokenSilently();
      console.log(token);
      dispatch(updateToken(token));
    };

    getToken();
    const interval = setInterval(getToken, 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isAuthenticated, dispatch, getAccessTokenSilently]);

  React.useEffect(() => {
    // ChessService.getPlayer (a new endpoint that gets or creates and gets)
    accessToken && dispatch(updatePlayer(playerOne)); // update to use player gotten from endpoint
  }, [accessToken, dispatch]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Button component={Link} to="/" color="secondary" variant="text">
          HOME
        </Button>
        <Box margin="auto">
          <Typography>
            In the game of chess, you can never let your adversary see your pieces. -Zapp Brannigan
          </Typography>
        </Box>
        <IconButton
          color="secondary"
          component="a"
          target="_blank"
          href="https://github.com/seamuslowry/brannigans-chess"
        >
          <GitHub />
        </IconButton>
        <Button component={Link} to="/faq" color="secondary" variant="text">
          FAQ
        </Button>
        <AuthButtonComponent variant="text" color="secondary" />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
