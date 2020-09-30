import React from 'react';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import ChessService, { Move, PieceColor } from '../../services/ChessService';
import Piece from '../Piece/Piece';
import { useDispatch, useSelector } from 'react-redux';
import { addMoves, clearMoves } from '../../store/activeGame/activeGame';
import { sendAlert } from '../../store/notifications/notifications';
import { AppState } from '../../store/store';

interface Props {
  gameId: number;
  color?: PieceColor;
}

const MoveList: React.FC<Props> = ({ gameId, color }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

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

  const moves = useSelector<AppState, Move[]>(state => state.activeGame.moveList);

  return (
    <Box width="100%" display="flex" flexDirection="column">
      {loading && <CircularProgress />}
      {moves &&
        moves.map(move => (
          <Box key={`move-list-item-${move.id}`} p={2}>
            <Typography>
              <Piece color={move.movingPiece.color} type={move.movingPiece.type} />
              moved from [{move.srcRow},{move.srcCol}] to [{move.dstRow},{move.dstCol}]
              {move.takenPiece && (
                <>
                  {' '}
                  and took <Piece color={move.takenPiece.color} type={move.takenPiece.type} />
                </>
              )}
              .
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

export default MoveList;
