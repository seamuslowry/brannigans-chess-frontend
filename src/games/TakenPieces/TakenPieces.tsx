import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Piece as PieceEntity, PieceColor } from '../../services/ChessService.types';
import ChessService from '../../services/ChessService';
import Piece from '../Piece/Piece';
import { clearTaken, makeGetTakenPieces, addPieces } from '../../store/activeGame/activeGame';
import { sendAlert } from '../../store/notifications/notifications';
import { AppState, useAppDispatch } from '../../store/store';
import usePieceSize from '../../utils/usePieceSize';

interface Props {
  gameId: number;
  color: PieceColor;
}

const TakenPieces: React.FC<Props> = ({ gameId, color }) => {
  const dispatch = useAppDispatch();
  const pieceSize = usePieceSize();

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    ChessService.getPieces(gameId, color, 'TAKEN')
      .then(res => {
        dispatch(addPieces(res.data));
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

  const pieces = useSelector<AppState, PieceEntity[]>(makeGetTakenPieces(color));

  return (
    <Box
      width="100%"
      display="grid"
      gridTemplateColumns={`repeat(2,${pieceSize})`}
      gridTemplateRows={`repeat(8,${pieceSize})`}
    >
      {loading && (
        <Box gridColumn="1/3" justifySelf="center">
          <CircularProgress />
        </Box>
      )}
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
