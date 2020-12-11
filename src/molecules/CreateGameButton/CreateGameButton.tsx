import React from 'react';
import { CircularProgress, Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { createGame } from '../../store/games/games';
import { unwrapResult } from '@reduxjs/toolkit';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(5)
  }
}));

const CreateGameButton: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    dispatch(createGame())
      .then(unwrapResult)
      .then(game => history.push(`/game/${game.uuid}`))
      .catch(() => setLoading(false));
  };

  return (
    <Fab
      variant="extended"
      aria-label="Create game"
      className={classes.fab}
      size="large"
      color="primary"
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? (
        <CircularProgress size="1.5rem" />
      ) : (
        <>
          <Add /> Create Game
        </>
      )}
    </Fab>
  );
};

export default CreateGameButton;
