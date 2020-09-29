import React from 'react';
import { CircularProgress, Fab, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import ChessService from '../../services/ChessService';
import { useDispatch } from 'react-redux';
import { sendAlert } from '../../store/notifications/notifications';

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
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    ChessService.createGame()
      .then(res => {
        history.push(`/game/${res.data.id}`);
      })
      .catch(e => {
        dispatch(sendAlert(`Could not create game: ${e.message}`));
      })
      .finally(() => {
        setLoading(false);
      });
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