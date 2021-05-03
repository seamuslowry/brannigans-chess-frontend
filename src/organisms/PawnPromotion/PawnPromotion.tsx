import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Piece from '../../atoms/Piece/Piece';
import { AppState, useAppDispatch } from '../../store/store';
import { PieceColor, PieceType, Piece as PieceEntity } from '../../services/ChessService.types';
import { makeGetPromatablePawn, promotePawn } from '../../store/pieces/pieces';

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

const useStyles = makeStyles({
  button: {
    width: '25%'
  }
});

const PawnPromotion: React.FC<Props> = ({ color, gameId }) => {
  const { row } = variants[color];
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const getPromotablePawn = React.useMemo(makeGetPromatablePawn, []);

  const pawn = useSelector<AppState, PieceEntity | undefined>(state =>
    getPromotablePawn(state.pieces, gameId, row)
  );

  // if (!pawn) return null;

  const handleSelection = (type: PieceType) => () => {
    setLoading(true);
    dispatch(promotePawn({ pieceId: pawn!.id, type })).finally(() => setLoading(false));
  };

  return (
    <>
      <Dialog open>
        <DialogTitle>Pawn Promotion</DialogTitle>
        <DialogContent>
          <IconButton
            className={classes.button}
            disabled={loading}
            onClick={handleSelection('QUEEN')}
          >
            <Piece type="QUEEN" color={color} />
          </IconButton>
          <IconButton
            className={classes.button}
            disabled={loading}
            onClick={handleSelection('ROOK')}
          >
            <Piece type="ROOK" color={color} />
          </IconButton>
          <IconButton
            className={classes.button}
            disabled={loading}
            onClick={handleSelection('BISHOP')}
          >
            <Piece type="BISHOP" color={color} />
          </IconButton>
          <IconButton
            className={classes.button}
            disabled={loading}
            onClick={handleSelection('KNIGHT')}
          >
            <Piece type="KNIGHT" color={color} />
          </IconButton>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PawnPromotion;
