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
import { Pagination } from '@material-ui/lab';
import ChessService from '../../services/ChessService';
import { useServiceCall } from '../../utils/hooks';
import CreateGameButton from '../CreateGameButton/CreateGameButton';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    height: '80vh',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1rem'
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

  const [page, setPage] = React.useState(1);

  const memoizedCall = React.useMemo(() => ChessService.getGames(true, { page: page - 1 }), [page]);
  const {
    loading,
    response = {
      content: undefined,
      totalElements: 0,
      totalPages: 0
    },
    error
  } = useServiceCall(memoizedCall);

  const handlePageChange = (e: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage);

  return (
    <Box display="flex" flexDirection="column" className={classes.root} alignItems="center">
      {loading && <CircularProgress />}
      {response.content && (
        <>
          <List className={classes.list}>
            {response.content.map(game => (
              <ListItem data-testid="game-list-item" key={`game-item-${game.id}`}>
                <ListItemText primary={game.uuid} />
                <ListItemSecondaryAction>
                  <Button href={`/game/${game.id}`} color="primary">
                    Join
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            {response.content.length === 0 && (
              <Typography align="center">No available games</Typography>
            )}
          </List>
          <Box m={1}>
            <Pagination
              count={response.totalPages}
              page={page}
              onChange={handlePageChange}
              size="large"
            />
          </Box>
        </>
      )}
      {error && <Typography color="error">Could not load games: {error}</Typography>}
      <CreateGameButton />
    </Box>
  );
};

export default GamesList;
