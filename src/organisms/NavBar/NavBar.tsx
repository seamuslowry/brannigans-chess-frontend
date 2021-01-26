import React from 'react';
import { AppBar, Box, Button, Hidden, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { GitHub } from '@material-ui/icons';
import Logout from '../../molecules/Logout/Logout';
import Login from '../../molecules/Login/Login';
import useLoggedIn from '../../utils/useLoggedIn';
import UserAvatar from '../../molecules/UserAvatar/UserAvatar';

const NavBar: React.FC = () => {
  const loggedIn = useLoggedIn();

  const AuthButtonComponent = loggedIn ? Logout : Login;

  return (
    <AppBar position="static">
      <Toolbar>
        <Button component={Link} to="/" color="secondary" variant="text">
          HOME
        </Button>
        <Box margin="auto">
          <Hidden smDown>
            <Typography>
              In the game of chess, you can never let your adversary see your pieces. -Zapp
              Brannigan
            </Typography>
          </Hidden>
        </Box>
        <IconButton component={Link} to="/user" color="secondary">
          <UserAvatar />
        </IconButton>
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
