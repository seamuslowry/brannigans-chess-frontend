import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import CreateGameButton from '../../molecules/CreateGameButton/CreateGameButton';
import ChessService from '../../services/ChessService';
import useServiceCall from '../../utils/useServiceCall';
import { GameStatusGroup } from '../../services/ChessService.types';
import GamesList from '../../organisms/GamesList/GamesList';
import TabbedList from '../../organisms/TabbedList/TabbedList';

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

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleStatusGroupChange = (newGroup: GameStatusGroup) => setStatusGroup(newGroup);

  return (
    <Box className={classes.root}>
      <TabbedList
        tabOptions={[
          { label: 'Open', value: GameStatusGroup.OPEN },
          { label: 'Active', value: GameStatusGroup.ACTIVE }
        ]}
        tabValue={statusGroup}
        onTabChange={handleStatusGroupChange}
        page={page}
        totalPages={response.totalPages}
        onPageChange={handlePageChange}
      >
        <GamesList games={response.content} loading={loading} error={error} />
      </TabbedList>
      <CreateGameButton />
    </Box>
  );
};

export default ViewGames;
