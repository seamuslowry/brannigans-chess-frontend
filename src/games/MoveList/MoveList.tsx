import React from 'react';
import { Box, CircularProgress, makeStyles, Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Move as MoveEntity } from '../../services/ChessService.types';
import { getSharedMovesTopic } from '../../store/activeGame/activeGame';
import { sendAlert } from '../../store/notifications/notifications';
import { AppState, useAppDispatch } from '../../store/store';
import Move from '../Move/Move';
import ChessService from '../../services/ChessService';
import useGameColors from '../../utils/useGameColor';
import useSubscription from '../../utils/useSubscription';
import { addMoves, makeSelectMoves } from '../../store/moves/moves';

interface Props {
  gameId: number;
}

const useStyles = makeStyles({
  paper: {
    height: '50vh',
    overflowY: 'auto'
  }
});

const MoveList: React.FC<Props> = ({ gameId }) => {
  useSubscription(getSharedMovesTopic(gameId));

  const dispatch = useAppDispatch();
  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);

  const ref = React.useRef<HTMLElement | null>(null);

  const colors = useGameColors();

  React.useEffect(() => {
    setLoading(true);
    // TODO make a thunk
    ChessService.getMoves(gameId, colors)
      .then(res => {
        dispatch(addMoves(res.data));
      })
      .catch(e => {
        dispatch(sendAlert(`Could not find ${colors} moves: ${e.message}`));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [gameId, colors, dispatch]);

  const getMoves = React.useMemo(makeSelectMoves, []);
  const moves = useSelector<AppState, MoveEntity[]>(state => getMoves(state.moves, gameId));

  React.useEffect(() => {
    moves.length && ref.current && (ref.current.scrollTop = ref.current.scrollHeight);
  }, [moves.length]);

  return (
    <Paper className={classes.paper} ref={ref}>
      {loading && (
        <Box textAlign="center" my={1}>
          <CircularProgress />
        </Box>
      )}
      {moves &&
        moves.map(move => (
          <Box key={`move-list-item-${move.id}`} p={2}>
            <Move move={move} />
          </Box>
        ))}
    </Paper>
  );
};

export default MoveList;
