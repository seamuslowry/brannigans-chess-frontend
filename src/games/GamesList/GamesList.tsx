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
import ChessService from '../../services/ChessService';
import { useServiceCall } from '../../utils/hooks';
import { Pagination } from '@material-ui/lab';
import CreateGameButton from '../CreateGameButton/CreateGameButton';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1rem'
  }
}));

const GamesList: React.FC = () => {
  const classes = useStyles();

  const [page, setPage] = React.useState(1);

  const memoizedCall = React.useMemo(() => ChessService.getGames(true, { page: page - 1 }), [page]);
  const {
    loading,
    response = {
      content: [],
      totalElements: 0,
      totalPages: 0
    },
    error
  } = useServiceCall(memoizedCall);

  const handlePageChange = (e: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage);

  return (
    <Box display="flex" flexDirection="column" width="40%" alignItems="center">
      {loading && <CircularProgress />}
      {!error && (
        <>
          <List className={classes.list}>
            {response.content.map(game => (
              <ListItem data-testid="game-list-item" key={`game-item-${game.id}`}>
                <ListItemText primary={game.uuid} />
                <ListItemSecondaryAction>
                  <Button color="primary">Join</Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
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
