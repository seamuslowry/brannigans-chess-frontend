import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { Game, PieceColor } from '../../../services/ChessService.types';
import { AppState, useAppDispatch } from '../../../store/store';
import { joinGame, selectGameById } from '../../../store/games/games';

interface Props {
  gameId: number;
  pieceColor: PieceColor;
}

const JoinGameButton: React.FC<Omit<ButtonProps, 'disabled' | 'onClick'> & Props> = ({
  gameId,
  pieceColor,
  ...rest
}) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = React.useState(false);

  const game = useSelector<AppState, Game | undefined>(state =>
    selectGameById(state.games, gameId)
  );

  const currentPlayer = game && game[pieceColor === 'WHITE' ? 'whitePlayer' : 'blackPlayer'];

  if (currentPlayer) return null;

  const handleClick = () => {
    setLoading(true);
    dispatch(joinGame({ gameId, pieceColor })).catch(() => setLoading(false));
  };

  return (
    <Button data-testid="join-game-button" {...rest} disabled={loading} onClick={handleClick}>
      Play
    </Button>
  );
};

export default JoinGameButton;
