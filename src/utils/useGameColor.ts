import React from 'react';
import { useSelector } from 'react-redux';
import { PieceColor, Player } from '../services/ChessService.types';
import { selectBlackId, selectGameStatus, selectWhiteId } from '../store/games/games';
import { AppState } from '../store/store';

const useGameColors = (gameId: number): PieceColor[] => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);
  const whiteAuth = useSelector<AppState, string | undefined>(state =>
    selectWhiteId(state.games, gameId)
  );
  const blackAuth = useSelector<AppState, string | undefined>(state =>
    selectBlackId(state.games, gameId)
  );
  const gameLoaded = useSelector<AppState, boolean>(
    state => !!selectGameStatus(state.games, gameId)
  );

  const authId = player?.authId;

  const isWhite = authId === whiteAuth;
  const isBlack = authId === blackAuth;

  const colors = React.useMemo<PieceColor[]>(
    () =>
      (isWhite && ['WHITE']) || (isBlack && ['BLACK']) || (gameLoaded && ['WHITE', 'BLACK']) || [],
    [isWhite, isBlack, gameLoaded]
  );

  return colors;
};

export default useGameColors;
