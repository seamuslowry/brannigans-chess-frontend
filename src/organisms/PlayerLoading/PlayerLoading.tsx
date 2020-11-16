import React from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';
import { authenticatePlayer, clearAuth } from '../../store/auth/auth';
import { useAppDispatch } from '../../store/store';
import useLoggedIn from '../../utils/useLoggedIn';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1
  }
}));

const PlayerLoading: React.FC = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const loggedIn = useLoggedIn();

  const classes = useStyles();

  const dispatch = useAppDispatch();

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    const fullyAuthenticate = () => {
      setLoading(true);
      dispatch(
        authenticatePlayer({
          getAccessToken: getAccessTokenSilently,
          playerInfo: {
            imageUrl: user.picture,
            name: user.name
          }
        })
      ).finally(() => {
        setLoading(false);
      });
    };

    fullyAuthenticate();
    const interval = setInterval(fullyAuthenticate, 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
      dispatch(clearAuth());
    };
  }, [isAuthenticated, dispatch, getAccessTokenSilently, user]);

  return (
    <Backdrop className={classes.backdrop} open={loading && !loggedIn}>
      <CircularProgress />
    </Backdrop>
  );
};

export default PlayerLoading;
