import React from 'react';
import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Tooltip,
  Typography
} from '@material-ui/core';
import ChessService from '../../services/ChessService';
import { useServiceCall } from '../../utils/hooks';
import { Help } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  list: {
    width: '60%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1rem'
  }
}));

const GamesList: React.FC = () => {
  const classes = useStyles();

  const memoizedCall = React.useMemo(() => ChessService.getGames(true), []);
  const { loading, response: games = [], error } = useServiceCall(memoizedCall);

  return (
    <>
      {loading && <CircularProgress />}
      <List className={classes.list}>
        {games.map(game => (
          <ListItem data-testid="game-list-item" key={`game-item-${game.id}`}>
            <ListItemIcon>
              <Tooltip
                title={
                  game.whitePlayer
                    ? `${game.whitePlayer.username} is playing white in this game`
                    : 'Join as white'
                }
              >
                <span>
                  <IconButton disabled={!!game.whitePlayer}>
                    <Help />
                  </IconButton>
                </span>
              </Tooltip>
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ align: 'center' }} primary={game.uuid} />
            <ListItemSecondaryAction>
              <Tooltip
                title={
                  game.blackPlayer
                    ? `${game.blackPlayer.username} is playing black in this game`
                    : 'Join as black'
                }
              >
                <span>
                  <IconButton disabled={!!game.blackPlayer}>
                    <Help />
                  </IconButton>
                </span>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {error && <Typography>Could not load games: {error}</Typography>}
    </>
  );
};

export default GamesList;
