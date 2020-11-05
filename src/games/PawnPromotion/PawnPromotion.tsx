import React from 'react';
import { Dialog, DialogActions, DialogTitle, IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Piece from '../Piece/Piece';
import { AppState, useAppDispatch } from '../../store/store';
import { PieceColor, PieceType, Piece as PieceEntity } from '../../services/ChessService.types';
import { makeGetPromatablePawn, addPieces } from '../../store/activeGame/activeGame';
import { sendAlert } from '../../store/notifications/notifications';
import ChessService from '../../services/ChessService';

type VariantValues = {
  [key in PieceColor]: { row: number };
};

const variants: VariantValues = {
  WHITE: { row: 0 },
  BLACK: { row: 7 }
};

interface Props {
  color: PieceColor;
  gameId: number;
}

const PawnPromotion: React.FC<Props> = ({ color, gameId }) => {
  const { row } = variants[color];
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();

  const getPromotablePawn = React.useMemo(makeGetPromatablePawn, []);

  const pawn = useSelector<AppState, PieceEntity | undefined>(state =>
    getPromotablePawn(state, row)
  );

  if (!pawn) return null;

  const handleSelection = (type: PieceType) => () => {
    setLoading(true);
    ChessService.promote(type, {
      col: pawn.positionCol,
      row,
      gameId
    })
      .then(res => {
        dispatch(
          addPieces([
            res.data,
            {
              ...pawn,
              status: 'REMOVED'
            }
          ])
        );
      })
      .catch(e => {
        dispatch(sendAlert(`Failed to promote the piece: ${e.message}`));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Dialog open>
        <DialogTitle>Pawn Promotion</DialogTitle>
        <DialogActions>
          <IconButton disabled={loading} onClick={handleSelection('QUEEN')}>
            <Piece type="QUEEN" color={color} />
          </IconButton>
          <IconButton disabled={loading} onClick={handleSelection('ROOK')}>
            <Piece type="ROOK" color={color} />
          </IconButton>
          <IconButton disabled={loading} onClick={handleSelection('BISHOP')}>
            <Piece type="BISHOP" color={color} />
          </IconButton>
          <IconButton disabled={loading} onClick={handleSelection('KNIGHT')}>
            <Piece type="KNIGHT" color={color} />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PawnPromotion;
