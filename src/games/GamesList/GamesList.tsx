import React from 'react';
import {
  Box,
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
import { Pagination } from '@material-ui/lab';

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
    <Box display="flex" flexDirection="column" width="60%" alignItems="center">
      {loading && <CircularProgress />}
      <List className={classes.list}>
        {response.content.map(game => (
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
      <Box m={1}>
        <Pagination
          count={response.totalPages}
          page={page}
          onChange={handlePageChange}
          size="large"
        />
      </Box>
      {error && <Typography>Could not load games: {error}</Typography>}
    </Box>
  );
};

export default GamesList;
