import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import ChessService, { Piece as PieceType, PieceColor } from '../../services/ChessService';
import Piece from '../Piece/Piece';
import { clearTaken, takePieces } from '../../store/activeGame/activeGame';
import { sendAlert } from '../../store/notifications/notifications';
import { AppState } from '../../store/store';
import { usePieceSize } from '../../utils/hooks';

interface Props {
  gameId: number;
  color: PieceColor;
}

const TakenPieces: React.FC<Props> = ({ gameId, color }) => {
  const dispatch = useDispatch();
  const pieceSize = usePieceSize();

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    ChessService.getPieces(gameId, color, true)
      .then(res => {
        dispatch(takePieces(res.data));
      })
      .catch(e => {
        dispatch(sendAlert(`Could not find ${color} taken pieces: ${e.message}`));
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      dispatch(clearTaken(color));
    };
  }, [gameId, color, dispatch]);

  const pieces = useSelector<AppState, PieceType[]>(state =>
    state.activeGame.takenPieces.filter(p => p.color === color)
  );

  return (
    <Box
      width="100%"
      display="grid"
      gridTemplateColumns={`repeat(2,${pieceSize})`}
      gridTemplateRows={`repeat(8,${pieceSize})`}
    >
      {loading && <CircularProgress />}
      {pieces &&
        pieces.map((piece, index) => (
          <Box
            key={`taken-piece-${piece.id}`}
            gridRow={Math.floor(index / 2) + 1}
            gridColumn={(index % 2) + 1}
          >
            <Piece color={piece.color} type={piece.type} />
          </Box>
        ))}
    </Box>
  );
};

export default TakenPieces;
