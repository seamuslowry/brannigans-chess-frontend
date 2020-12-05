import React from 'react';
import { useSelector } from 'react-redux';
import { Move as MoveEntity } from '../../services/ChessService.types';
import { AppState, useAppDispatch } from '../../store/store';
import useGameColors from '../../utils/useGameColor';
import useSubscription from '../../utils/useSubscription';
import { getMoves, getSharedMovesTopic, makeSelectMoves } from '../../store/moves/moves';
import MoveList from '../MoveList/MoveList';

interface Props {
  gameId: number;
}

const GameMoveList: React.FC<Props> = ({ gameId }) => {
  useSubscription(getSharedMovesTopic(gameId));

  const dispatch = useAppDispatch();

  const [loading, setLoading] = React.useState(false);

  const colors = useGameColors(gameId);

  React.useEffect(() => {
    setLoading(true);
    dispatch(getMoves({ gameId, colors })).finally(() => setLoading(false));
  }, [gameId, colors, dispatch]);

  const selectMoves = React.useMemo(makeSelectMoves, []);
  const moves = useSelector<AppState, MoveEntity[]>(state => selectMoves(state.moves, gameId));

  return <MoveList moves={moves} loading={loading} />;
};

export default GameMoveList;
