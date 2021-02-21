import React from 'react';
import { Avatar, AvatarProps, makeStyles } from '@material-ui/core';
import useLoggedIn from '../../utils/useLoggedIn';
import { useSelector } from 'react-redux';
import { Player } from '../../services/ChessService.types';
import { AppState } from '../../store/store';

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4)
  }
}));

const UserAvatar: React.FC<Omit<AvatarProps, 'alt' | 'src' | 'className' | 'imgProps'>> = props => {
  const loggedIn = useLoggedIn();
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);

  const classes = useStyles();

  return loggedIn && player ? (
    <Avatar
      {...props}
      alt={player.name}
      src={player.imageUrl}
      className={classes.small}
      imgProps={{ referrerPolicy: 'no-referrer' }}
    />
  ) : null;
};

export default UserAvatar;
