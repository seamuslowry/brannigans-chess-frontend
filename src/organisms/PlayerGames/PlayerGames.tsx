import React from 'react';
import ChessService from '../../services/ChessService';
import useServiceCall from '../../utils/useServiceCall';
import { GameStatusGroup, Player } from '../../services/ChessService.types';
import GamesList from '../../organisms/GamesList/GamesList';
import TabbedList from '../../organisms/TabbedList/TabbedList';

interface Props {
  player: Player;
}

const PlayerGames: React.FC<Props> = ({ player }) => {
  const [page, setPage] = React.useState(1);
  const [statusGroup, setStatusGroup] = React.useState<GameStatusGroup>(GameStatusGroup.ACTIVE);

  const memoizedCall = React.useCallback(
    () => ChessService.getPlayerGames(player.authId, statusGroup, { page: page - 1 }),
    [player.authId, page, statusGroup]
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
    <TabbedList
      tabOptions={[
        { label: 'Open', value: GameStatusGroup.OPEN },
        { label: 'Active', value: GameStatusGroup.ACTIVE },
        { label: 'Complete', value: GameStatusGroup.INACTIVE }
      ]}
      tabValue={statusGroup}
      onTabChange={handleStatusGroupChange}
      page={page}
      totalPages={response.totalPages}
      onPageChange={handlePageChange}
    >
      <GamesList games={response.content} loading={loading} error={error} />
    </TabbedList>
  );
};

export default PlayerGames;
