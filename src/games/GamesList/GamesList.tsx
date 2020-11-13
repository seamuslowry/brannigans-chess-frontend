import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
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
import ChessService from '../../services/ChessService';
import useServiceCall from '../../utils/useServiceCall';
import { GameStatusGroup } from '../../services/ChessService.types';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    height: '80vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper,
    borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`
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
      content: undefined,
      totalElements: 0,
      totalPages: 0
    },
    error
  } = useServiceCall(memoizedCall);

  const handlePageChange = (e: React.ChangeEvent<unknown>, newPage: number) => setPage(newPage);
  const handleStatusGroupChange = (newGroup: GameStatusGroup) => () => setStatusGroup(newGroup);

  return (
    <Box display="flex" flexDirection="column" className={classes.root} alignItems="center">
      {loading && <CircularProgress />}
      {response.content && (
        <>
          <ButtonGroup
            classes={{ groupedContainedHorizontal: classes.buttonGroup }}
            fullWidth
            variant="contained"
            color="primary"
          >
            <Button
              onClick={handleStatusGroupChange(GameStatusGroup.OPEN)}
              color={statusGroup === GameStatusGroup.OPEN ? 'secondary' : undefined}
            >
              Open
            </Button>
            <Button
              onClick={handleStatusGroupChange(GameStatusGroup.ACTIVE)}
              color={statusGroup === GameStatusGroup.ACTIVE ? 'secondary' : undefined}
            >
              Active
            </Button>
            <Button
              onClick={handleStatusGroupChange(GameStatusGroup.INACTIVE)}
              color={statusGroup === GameStatusGroup.INACTIVE ? 'secondary' : undefined}
            >
              Inactive
            </Button>
          </ButtonGroup>
          <List className={classes.list}>
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
