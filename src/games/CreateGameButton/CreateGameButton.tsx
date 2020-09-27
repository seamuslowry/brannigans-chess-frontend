import React from 'react';
import { Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(5)
  }
}));

const CreateGameButton: React.FC = () => {
  const classes = useStyles();

  return (
    <Fab
      variant="extended"
      aria-label="Create game"
      className={classes.fab}
      size="large"
      color="primary"
    >
      <Add /> Create Game
    </Fab>
  );
};

export default CreateGameButton;
