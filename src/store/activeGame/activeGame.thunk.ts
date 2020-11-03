import ChessService from '../../services/ChessService';
import { sendAlert } from '../notifications/notifications';
import { ThunkResult } from '../store';
import { selectTile, setTile, addMoves, takePieces } from './activeGame';

export const clickTile = (row: number, col: number): ThunkResult<Promise<void>> => (
  dispatch,
  getState
) => {
  const state = getState();
  const { selectedPosition, id: gameId, tiles } = state.activeGame;

  if (selectedPosition && selectedPosition[0] === row && selectedPosition[1] === col) {
    dispatch(selectTile(row, col, false));
  } else if (selectedPosition) {
    return ChessService.move(gameId, selectedPosition[0], selectedPosition[1], row, col)
      .then(res => {
        const move = res.data;

        dispatch(selectTile(selectedPosition[0], selectedPosition[1], false));
        dispatch(setTile(move.srcRow, move.srcCol, undefined));
        dispatch(setTile(move.dstRow, move.dstCol, move.movingPiece));
        dispatch(addMoves([move]));
        move.takenPiece && dispatch(takePieces([move.takenPiece]));
        move.moveType === 'EN_PASSANT' && dispatch(setTile(move.srcRow, move.dstCol, undefined));
        if (move.moveType === 'KING_SIDE_CASTLE') {
          dispatch(setTile(move.srcRow, move.dstCol + 1, undefined));
          dispatch(
            setTile(move.srcRow, move.dstCol - 1, { color: move.movingPiece.color, type: 'ROOK' })
          );
        } else if (move.moveType === 'QUEEN_SIDE_CASTLE') {
          dispatch(setTile(move.srcRow, move.dstCol - 2, undefined));
          dispatch(
            setTile(move.srcRow, move.dstCol + 1, { color: move.movingPiece.color, type: 'ROOK' })
          );
        }
      })
      .catch(e => {
        e.response ? dispatch(sendAlert(e.response.data)) : dispatch(sendAlert('Network Error'));
      });
  } else if (tiles[row][col].type) {
    dispatch(selectTile(row, col, true));
  }

  return Promise.resolve();
};
