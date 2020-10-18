import React from 'react';
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { GitHub } from '@material-ui/icons';

const NavBar: React.FC = () => {
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
        <Button component={Link} to="/faq" color="secondary" variant="text">
          FAQ
        </Button>
        <IconButton
          color="secondary"
          component="a"
          target="_blank"
          href="https://github.com/seamuslowry/brannigans-chess"
        >
          <GitHub />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
