import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { GitHub } from '@material-ui/icons';
import Logout from '../../auth/Logout/Logout';
import { AppState } from '../../store/store';
import { AuthState } from '../../store/auth/auth';
import Login from '../../auth/Login/Login';
import Signup from '../../auth/Signup/Signup';

const NavBar: React.FC = () => {
  const { player } = useSelector<AppState, AuthState>(state => state.auth);

  const authButtonComponents = player ? [Logout] : [Signup, Login];

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
        {authButtonComponents.map((AuthButtonComponent, index) => (
          <AuthButtonComponent
            key={`auth-button-${AuthButtonComponent.displayName}-${index}`}
            variant="text"
            color="secondary"
          />
        ))}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
