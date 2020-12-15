import React from 'react';
import { useSelector } from 'react-redux';
import { Game, PieceColor, Player } from '../../services/ChessService.types';
import { selectGameById } from '../../store/games/games';
import { AppState } from '../../store/store';
import JoinGameButton from './JoinGameButton/JoinGameButton';
import LeaveGameButton from './LeaveGameButton/LeaveGameButton';

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

  const fullGame = game && !!game.whitePlayer && !!game.blackPlayer;

  // if (fullGame || loggedInPlayer?.authId !== currentPlayer?.authId) return null; // leave game
  // if (currentPlayer) return null; // join game

  return (
    <>
      {!(currentPlayer || fullGame) && (
        <JoinGameButton size="small" color="primary" gameId={gameId} pieceColor={color} />
      )}
      {!(fullGame || loggedInPlayer?.authId !== currentPlayer?.authId) && (
        <LeaveGameButton size="small" color="secondary" gameId={gameId} pieceColor={color} />
      )}
    </>
  );
};

export default PlayerActionButton;
