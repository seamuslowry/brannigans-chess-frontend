import { createAsyncThunk } from '@reduxjs/toolkit';
import ChessService from '../../services/ChessService';
import { Move } from '../../services/ChessService.types';
import { AppState } from '../store';

export interface TilePosition {
  row: number;
  col: number;
}

export const clickTile = createAsyncThunk<void | boolean | Move, TilePosition, { state: AppState }>(
  'chess/activeGame/clickTile',
  async (position: TilePosition, { getState }) => {
    const { row, col } = position;
    const { selectedPosition, id: gameId, tiles } = getState().activeGame;

    if (selectedPosition && selectedPosition[0] === row && selectedPosition[1] === col) {
      return false;
    } else if (selectedPosition) {
      const response = await ChessService.move(
        gameId,
        selectedPosition[0],
        selectedPosition[1],
        row,
        col
      );
      return response.data;
    } else if (tiles[row][col].type) {
      return true;
    }

    // TODO is this necessary?
    return Promise.resolve();
  }
);
