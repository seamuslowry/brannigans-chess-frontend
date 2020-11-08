import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Game, PieceColor, Player } from '../../../services/ChessService.types';
import { AppState, useAppDispatch } from '../../../store/store';
import { leaveGame, selectGameById } from '../../../store/games/games';

interface Props {
  gameId: number;
  pieceColor: PieceColor;
}

const LeaveGameButton: React.FC<Omit<ButtonProps, 'disabled' | 'onClick'> & Props> = ({
  gameId,
  pieceColor,
  ...rest
}) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = React.useState(false);
  const game = useSelector<AppState, Game | undefined>(state =>
    selectGameById(state.games, gameId)
  );
  const loggedInPlayer = useSelector<AppState, Player | undefined>(state => state.auth.player);

  const fullGame = game && !!game.whitePlayer && !!game.blackPlayer;
  const currentPlayer = game && game[pieceColor === 'WHITE' ? 'whitePlayer' : 'blackPlayer'];
  if (fullGame || loggedInPlayer?.authId !== currentPlayer?.authId) return null;

  const handleClick = () => {
    setLoading(true);
    dispatch(leaveGame(gameId)).finally(() => setLoading(false));
  };

  return (
    <Button {...rest} data-testid="leave-game-button" disabled={loading} onClick={handleClick}>
      Quit
    </Button>
  );
};

export default LeaveGameButton;
