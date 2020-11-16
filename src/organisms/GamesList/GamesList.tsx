import React from 'react';
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Game } from '../../services/ChessService.types';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    height: '75vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: `0 0 1rem 1rem`,
    textAlign: 'center'
  },
  listItemContainer: {
    height: '10%',
    display: 'flex'
  }
}));

interface Props {
  games: Game[];
  loading?: boolean;
  error?: string;
}

const GamesList: React.FC<Props> = ({ games, loading, error }) => {
  const classes = useStyles();

  return (
    <List className={classes.list}>
      {loading && <CircularProgress />}
      {games.map(game => (
        <ListItem
          classes={{
            container: classes.listItemContainer
          }}
          data-testid="game-list-item"
          key={`game-item-${game.id}`}
        >
          <ListItemText primary={game.uuid} />
          <ListItemSecondaryAction>
            <Button component={Link} to={`/game/${game.id}`} color="primary">
              View
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
      {error && <Typography color="error">Could not load games: {error}</Typography>}
      {!loading && !error && games.length === 0 && (
        <Typography align="center">No available games</Typography>
      )}
    </List>
  );
};

export default GamesList;
