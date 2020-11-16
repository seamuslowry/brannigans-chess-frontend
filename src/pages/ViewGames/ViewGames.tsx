import React from 'react';
import { Box, makeStyles, Tab, Tabs } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import CreateGameButton from '../../molecules/CreateGameButton/CreateGameButton';
import ChessService from '../../services/ChessService';
import useServiceCall from '../../utils/useServiceCall';
import { GameStatusGroup } from '../../services/ChessService.types';
import GamesList from '../../organisms/GamesList/GamesList';

const useStyles = makeStyles(theme => ({
  root: {
    width: '40vw',
    [theme.breakpoints.down('sm')]: {
      width: '80vw'
    }
  }
}));

const ViewGames: React.FC = () => {
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
      <GamesList games={response.content} loading={loading} error={error} />
      <Box my={1} display="flex" justifyContent="center">
        <Pagination
          count={response.totalPages}
          page={page}
          onChange={handlePageChange}
          size="large"
        />
      </Box>
      <CreateGameButton />
    </Box>
  );
};

export default ViewGames;
