import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Piece as PieceEntity, PieceColor } from '../../services/ChessService.types';
import Piece from '../Piece/Piece';
import { clearTaken, makeGetTakenPieces, getPieces } from '../../store/activeGame/activeGame';
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
    dispatch(getPieces({ gameId, color, status: 'TAKEN' })).finally(() => setLoading(false));

    return () => {
      dispatch(clearTaken(color));
    };
  }, [gameId, color, dispatch]);

  const getTakenPieces = React.useMemo(makeGetTakenPieces, []);
  const pieces = useSelector<AppState, PieceEntity[]>(state => getTakenPieces(state, color));

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
