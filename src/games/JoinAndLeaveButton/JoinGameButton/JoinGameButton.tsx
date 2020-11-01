import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import ChessService from '../../../services/ChessService';
import { sendAlert } from '../../../store/notifications/notifications';
import { PieceColor, Player } from '../../../services/ChessService.types';
import { AxiosError } from 'axios';
import { AppState } from '../../../store/store';

interface Props {
  gameId: number;
  pieceColor: PieceColor;
}

const JoinGameButton: React.FC<Omit<ButtonProps, 'disabled' | 'onClick'> & Props> = ({
  gameId,
  pieceColor,
  ...rest
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);
  const currentPlayer = useSelector<AppState, Player | null>(
    state => state.activeGame[pieceColor === 'WHITE' ? 'whitePlayer' : 'blackPlayer']
  );

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
