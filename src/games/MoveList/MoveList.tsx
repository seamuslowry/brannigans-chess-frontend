import React from 'react';
import { Box, CircularProgress, makeStyles, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Move as MoveType, PieceColor } from '../../services/ChessService.types';
import { addMoves, clearMoves } from '../../store/activeGame/activeGame';
import { sendAlert } from '../../store/notifications/notifications';
import { AppState } from '../../store/store';
import Move from '../Move/Move';
import ChessService from '../../services/ChessService';

interface Props {
  gameId: number;
  color?: PieceColor;
}

const useStyles = makeStyles({
  paper: {
    height: '50vh',
    overflowY: 'auto'
  }
});

const MoveList: React.FC<Props> = ({ gameId, color }) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [loading, setLoading] = React.useState(false);

  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    setLoading(true);
    ChessService.getMoves(gameId, color)
      .then(res => {
        dispatch(addMoves(res.data));
      })
      .catch(e => {
        dispatch(sendAlert(`Could not find ${color} moves: ${e.message}`));
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      dispatch(clearMoves());
    };
  }, [gameId, color, dispatch]);

  const moves = useSelector<AppState, MoveType[]>(state => state.activeGame.moveList);

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
