import React from 'react';
import { useSelector } from 'react-redux';
import { PieceColor, Player } from '../services/ChessService.types';
import { AppState } from '../store/store';

const useGameColors = (): PieceColor[] => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);
  const whitePlayer = useSelector<AppState, Player | null>(state => state.activeGame.whitePlayer);
  const blackPlayer = useSelector<AppState, Player | null>(state => state.activeGame.blackPlayer);

  const isWhite = player?.authId === whitePlayer?.authId;
  const isBlack = player?.authId === blackPlayer?.authId;

  const colors = React.useMemo<PieceColor[]>(
    () => (isWhite && ['WHITE']) || (isBlack && ['BLACK']) || [],
    [isWhite, isBlack]
  );

  return colors;
};

export default useGameColors;
