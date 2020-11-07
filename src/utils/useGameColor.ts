import React from 'react';
import { useSelector } from 'react-redux';
import { PieceColor, Player } from '../services/ChessService.types';
import { AppState } from '../store/store';

const useGameColors = (): PieceColor[] => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);
  const whitePlayer = useSelector<AppState, string | undefined>(
    state => state.activeGame.whitePlayer?.authId
  );
  const blackPlayer = useSelector<AppState, string | undefined>(
    state => state.activeGame.blackPlayer?.authId
  );

  const isWhite = player?.authId === whitePlayer;
  const isBlack = player?.authId === blackPlayer;

  const colors = React.useMemo<PieceColor[]>(
    () => (isWhite && ['WHITE']) || (isBlack && ['BLACK']) || [],
    [isWhite, isBlack]
  );

  return colors;
};

export default useGameColors;
