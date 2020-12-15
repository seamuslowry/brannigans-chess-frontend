import React from 'react';
import { useSelector } from 'react-redux';
import { statusGroupMap } from '../../services/ChessService';
import { Game, GameStatusGroup, PieceColor, Player } from '../../services/ChessService.types';
import { selectGameById } from '../../store/games/games';
import { AppState } from '../../store/store';
import JoinGameButton from './JoinGameButton/JoinGameButton';
import LeaveGameButton from './LeaveGameButton/LeaveGameButton';
import ResignGameButton from './ResignGameButton/ResignGameButton';

interface Props {
  gameId: number;
  color: PieceColor;
}

const PlayerActionButton: React.FC<Props> = ({ gameId, color }) => {
  const game = useSelector<AppState, Game | undefined>(state =>
    selectGameById(state.games, gameId)
  );

  const currentPlayer = game && game[color === 'WHITE' ? 'whitePlayer' : 'blackPlayer'];
  const loggedInPlayer = useSelector<AppState, Player | undefined>(state => state.auth.player);
  const playerIsColor = loggedInPlayer?.authId === currentPlayer?.authId;

  const gameIsWaiting = game && statusGroupMap[GameStatusGroup.OPEN].includes(game.status);
  const gameIsActive = game && statusGroupMap[GameStatusGroup.ACTIVE].includes(game.status);

  return (
    <>
      {!currentPlayer && gameIsWaiting && (
        <JoinGameButton size="small" color="primary" gameId={gameId} pieceColor={color} />
      )}
      {playerIsColor && gameIsWaiting && (
        <LeaveGameButton size="small" color="secondary" gameId={gameId} pieceColor={color} />
      )}
      {gameIsActive && playerIsColor && <ResignGameButton size="small" gameId={gameId} />}
    </>
  );
};

export default PlayerActionButton;
