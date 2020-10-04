import ChessService from '../../services/ChessService';
import { sendAlert } from '../notifications/notifications';
import { ThunkResult } from '../store';
import { selectTile, setTile, addMove, takePiece } from './activeGame';

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
        dispatch(addMove(move));
        move.takenPiece && dispatch(takePiece(move.takenPiece));
        move.moveType === 'EN_PASSANT' && dispatch(setTile(move.srcRow, move.dstCol, undefined));
      })
      .catch(e => {
        e.response ? dispatch(sendAlert(e.response.data)) : dispatch(sendAlert('Network Error'));
      });
  } else if (tiles[row][col].type) {
    dispatch(selectTile(row, col, true));
  }

  return Promise.resolve();
};

export const getPieces = (gameId: number): ThunkResult<void> => async dispatch => {
  return ChessService.getPieces(gameId, undefined, false)
    .then(res => {
      res.data.forEach(piece => {
        dispatch(setTile(piece.positionRow, piece.positionCol, piece));
      });
    })
    .catch(e => {
      dispatch(sendAlert(`Could not get pieces for game: ${e.message}`));
    });
};
