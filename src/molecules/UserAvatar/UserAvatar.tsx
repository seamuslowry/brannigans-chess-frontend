import React from 'react';
import { Avatar, AvatarProps, makeStyles } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';
import useLoggedIn from '../../utils/useLoggedIn';

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  }
}));

const UserAvatar: React.FC<Omit<AvatarProps, 'alt' | 'src' | 'className' | 'imgProps'>> = props => {
  const { user } = useAuth0();
  const loggedIn = useLoggedIn();

  const classes = useStyles();

  return loggedIn && user ? (
    <Avatar
      {...props}
      alt={user.name}
      src={user.picture}
      className={classes.small}
      imgProps={{ referrerPolicy: 'no-referrer' }}
    />
  ) : null;
};

export default UserAvatar;
