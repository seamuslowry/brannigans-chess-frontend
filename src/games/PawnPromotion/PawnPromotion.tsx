import React from 'react';
import { Dialog, DialogActions, DialogTitle, IconButton, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Piece from '../Piece/Piece';
import { AppState } from '../../store/store';
import ChessService, { PieceColor, PieceType } from '../../services/ChessService';
import { setTile, TileInfo } from '../../store/activeGame/activeGame';
import { sendAlert } from '../../store/notifications/notifications';

const useStyles = makeStyles({
  center: {
    textAlign: 'center'
  }
});

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
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  const tiles = useSelector<AppState, TileInfo[][]>(state => state.activeGame.tiles);

  const promoteCol = tiles[row].findIndex(i => i.type === 'PAWN');

  // when websockets and game status comes in, drive off game status, not last move
  React.useEffect(() => {
    if (promoteCol >= 0) {
      setOpen(true);
    }
  }, [promoteCol]);

  const handleSelection = (type: PieceType) => () => {
    setLoading(true);
    ChessService.promote(type, {
      col: promoteCol,
      row,
      gameId
    })
      .then(res => {
        dispatch(setTile(res.data.positionRow, res.data.positionCol, res.data));
        setOpen(false);
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
      <Dialog open={open}>
        <DialogTitle className={classes.center}>Pawn Promotion</DialogTitle>
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
