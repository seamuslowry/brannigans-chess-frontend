import React from 'react';
import { useSelector } from 'react-redux';
import { PieceColor, Player } from '../services/ChessService.types';
import { selectBlackId, selectWhiteId } from '../store/games/games';
import { AppState } from '../store/store';

const useGameColors = (gameId: number): PieceColor[] => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);
  const whiteAuth = useSelector<AppState, string | undefined>(state =>
    selectWhiteId(state.games, gameId)
  );
  const blackAuth = useSelector<AppState, string | undefined>(state =>
    selectBlackId(state.games, gameId)
  );

  const isWhite = player?.authId === whiteAuth;
  const isBlack = player?.authId === blackAuth;

  const colors = React.useMemo<PieceColor[]>(
    () => (isWhite && ['WHITE']) || (isBlack && ['BLACK']) || [],
    [isWhite, isBlack]
  );

  return colors;
};

export default useGameColors;
