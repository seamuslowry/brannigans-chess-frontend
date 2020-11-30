import React from 'react';
import { Box, CircularProgress, makeStyles, Paper } from '@material-ui/core';
import { Move as MoveEntity } from '../../services/ChessService.types';
import Move from '../../molecules/Move/Move';

interface Props {
  moves: MoveEntity[];
  loading?: boolean;
}

const useStyles = makeStyles({
  paper: {
    height: '50vh',
    overflowY: 'auto'
  }
});

const MoveList: React.FC<Props> = ({ moves, loading }) => {
  const classes = useStyles();

  const ref = React.useRef<HTMLElement | null>(null);

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
