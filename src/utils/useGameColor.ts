import { useSelector } from 'react-redux';
import { PieceColor, Player } from '../services/ChessService.types';
import { AppState } from '../store/store';

const useGameColor = (): PieceColor | undefined => {
  const player = useSelector<AppState, Player | undefined>(state => state.auth.player);
  const whitePlayer = useSelector<AppState, Player | null>(state => state.activeGame.whitePlayer);
  const blackPlayer = useSelector<AppState, Player | null>(state => state.activeGame.blackPlayer);

  const isWhite = player?.authId === whitePlayer?.authId;
  const isBlack = player?.authId === blackPlayer?.authId;

  return (isWhite && 'WHITE') || (isBlack && 'BLACK') || undefined;
};

export default useGameColor;
