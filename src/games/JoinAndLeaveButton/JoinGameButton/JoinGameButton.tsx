import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useSelector } from 'react-redux';
import ChessService from '../../../services/ChessService';
import { sendAlert } from '../../../store/notifications/notifications';
import { Game, PieceColor } from '../../../services/ChessService.types';
import { AxiosError } from 'axios';
import { AppState, useAppDispatch } from '../../../store/store';
import { selectGameById } from '../../../store/games/games';

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
    ChessService.joinGame(gameId, pieceColor)
      .catch((e: AxiosError) => {
        let alert = '';
        if (e.response?.status === 409) {
          alert = `Could not join game: ${e.response.data}`;
        } else {
          alert = `Error while joining: ${e.message}`;
        }
        dispatch(sendAlert(alert));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Button data-testid="join-game-button" {...rest} disabled={loading} onClick={handleClick}>
      Play
    </Button>
  );
};

export default JoinGameButton;
