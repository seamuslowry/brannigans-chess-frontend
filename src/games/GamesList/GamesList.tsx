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
  Tab,
  Tabs,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';
import CreateGameButton from '../CreateGameButton/CreateGameButton';
import ChessService from '../../services/ChessService';
import useServiceCall from '../../utils/useServiceCall';
import { GameStatusGroup } from '../../services/ChessService.types';

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
  },
  buttonGroup: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
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
  const [statusGroup, setStatusGroup] = React.useState<GameStatusGroup>(GameStatusGroup.ACTIVE);

  const memoizedCall = React.useCallback(
    () => ChessService.getGames(statusGroup, { page: page - 1 }),
    [page, statusGroup]
  );
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
  const handleStatusGroupChange = (e: React.ChangeEvent<unknown>, newGroup: GameStatusGroup) =>
    setStatusGroup(newGroup);

  return (
    <Box className={classes.root}>
      <Tabs value={statusGroup} onChange={handleStatusGroupChange} variant="fullWidth">
        <Tab value={GameStatusGroup.OPEN} label="Open" />
        <Tab value={GameStatusGroup.ACTIVE} label="Active" />
      </Tabs>
      <List className={classes.list}>
        {loading && <CircularProgress />}
        {response.content.map(game => (
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
        {!loading && response.content.length === 0 && (
          <Typography align="center">No available games</Typography>
        )}
      </List>
      <Box my={1} display="flex" justifyContent="center">
        <Pagination
          count={response.totalPages}
          page={page}
          onChange={handlePageChange}
          size="large"
        />
      </Box>
      {error && <Typography color="error">Could not load games: {error}</Typography>}
      <CreateGameButton />
    </Box>
  );
};

export default GamesList;
