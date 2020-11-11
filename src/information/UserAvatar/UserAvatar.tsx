import React from 'react';
import { Avatar, AvatarProps, makeStyles } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';
import { authenticatePlayer, clearAuth } from '../../store/auth/auth';
import { useAppDispatch } from '../../store/store';
import useLoggedIn from '../../utils/useLoggedIn';

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  }
}));

const UserAvatar: React.FC<Omit<AvatarProps, 'alt' | 'src' | 'className'>> = props => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const loggedIn = useLoggedIn();

  const dispatch = useAppDispatch();
  const classes = useStyles();

  React.useEffect(() => {
    if (!isAuthenticated) return;
    const fullyAuthenticate = () => {
      dispatch(
        authenticatePlayer({
          getAccessToken: getAccessTokenSilently,
          playerInfo: {
            imageUrl: user.picture,
            name: user.name
          }
        })
      );
    };

    fullyAuthenticate();
    const interval = setInterval(fullyAuthenticate, 60 * 60 * 1000);

    return () => {
      clearInterval(interval);
      dispatch(clearAuth());
    };
  }, [isAuthenticated, dispatch, getAccessTokenSilently, user]);

  return loggedIn && user ? (
    <Avatar
      alt={user.name}
      src={user.picture}
      className={classes.small}
      imgProps={{ referrerPolicy: 'no-reerrer' }}
    />
  ) : null;
};

export default UserAvatar;
