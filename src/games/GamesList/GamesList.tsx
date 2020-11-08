import React from 'react';
import {
  Box,
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
import { Pagination } from '@material-ui/lab';
import CreateGameButton from '../CreateGameButton/CreateGameButton';
import { AppState, useAppDispatch } from '../../store/store';
import { getGames, selectPage } from '../../store/games/games';
import { useSelector } from 'react-redux';
import { Game } from '../../services/ChessService.types';
import { unwrapResult } from '@reduxjs/toolkit';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    height: '80vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1rem'
  },
  listItemContainer: {
    height: '10%',
    display: 'flex'
  },
  root: {
    width: '40vw',
    [theme.breakpoints.down('sm')]: {
      width: '80vw'
    }
  }
}));

const GamesList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const games = useSelector<AppState, Game[]>(state => selectPage(state.games, page));

  React.useEffect(() => {
    setLoading(true);
    dispatch(getGames({ active: true, page }))
      .then(unwrapResult)
      .then(r => {
        setTotalPages(r.totalPages);
      })
      .catch(e => {
        setError(e.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch, page]);

  const handlePageChange = (e: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage);

  return (
    <Box display="flex" flexDirection="column" className={classes.root} alignItems="center">
      {loading && <CircularProgress />}
      {!loading && (
        <>
          <List className={classes.list}>
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
            {games.length === 0 && <Typography align="center">No available games</Typography>}
          </List>
          <Box m={1}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} size="large" />
          </Box>
        </>
      )}
      {error && <Typography color="error">Could not load games: {error}</Typography>}
      <CreateGameButton />
    </Box>
  );
};

export default GamesList;
