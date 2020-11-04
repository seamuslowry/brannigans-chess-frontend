import React from 'react';
import { Avatar, AvatarProps, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { updatePlayer, updateToken } from '../../store/auth/auth';
import { AppState, useAppDispatch } from '../../store/store';
import ChessService from '../../services/ChessService';
import { sendAlert } from '../../store/notifications/notifications';
import useLoggedIn from '../../utils/useLoggedIn';

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  }
}));

const UserAvatar: React.FC<Omit<AvatarProps, 'alt' | 'src' | 'className'>> = props => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const accessToken = useSelector<AppState, string | undefined>(state => state.auth.token);
  const loggedIn = useLoggedIn();

  const dispatch = useAppDispatch();
  const classes = useStyles();

  React.useEffect(() => {
    if (!isAuthenticated) return;
    const getToken = async () => {
      const token = await getAccessTokenSilently();
      dispatch(updateToken(token));
      localStorage.setItem('token', token);
    };

    getToken();
    const interval = setInterval(getToken, 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
      localStorage.removeItem('token');
    };
  }, [isAuthenticated, dispatch, getAccessTokenSilently]);

  React.useEffect(() => {
    accessToken &&
      ChessService.authenticatePlayer({
        imageUrl: user.picture,
        name: user.name
      })
        .then(res => {
          dispatch(updatePlayer(res.data));
        })
        .catch(e => {
          dispatch(sendAlert(`Error finding Player: ${e.message}`));
        });
  }, [accessToken, dispatch, user]);

  return loggedIn && user ? (
    <Avatar alt={user.name} src={user.picture} className={classes.small} />
  ) : null;
};

export default UserAvatar;
