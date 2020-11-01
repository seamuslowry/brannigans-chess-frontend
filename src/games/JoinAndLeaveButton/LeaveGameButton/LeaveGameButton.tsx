import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import ChessService from '../../../services/ChessService';
import { sendAlert } from '../../../store/notifications/notifications';
import { AxiosError } from 'axios';
import { PieceColor, Player } from '../../../services/ChessService.types';
import { AppState } from '../../../store/store';

interface Props {
  gameId: number;
  pieceColor: PieceColor;
}

const LeaveGameButton: React.FC<Omit<ButtonProps, 'disabled' | 'onClick'> & Props> = ({
  gameId,
  pieceColor,
  ...rest
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);
  const fullGame = useSelector<AppState, boolean>(
    state => !!state.activeGame.whitePlayer && !!state.activeGame.blackPlayer
  );
  const loggedInPlayer = useSelector<AppState, Player | undefined>(state => state.auth.player);
  const currentPlayer = useSelector<AppState, Player | null>(
    state => state.activeGame[pieceColor === 'WHITE' ? 'whitePlayer' : 'blackPlayer']
  );

  if (fullGame || loggedInPlayer?.authId !== currentPlayer?.authId) return null;

  const handleClick = () => {
    setLoading(true);
    ChessService.leaveGame(gameId)
      .catch((e: AxiosError) => {
        let alert = '';
        if (e.response?.status === 409) {
          alert = `Could not leave game: ${e.response.data}`;
        } else {
          alert = `Error while leaving: ${e.message}`;
        }
        dispatch(sendAlert(alert));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Button {...rest} data-testid="leave-game-button" disabled={loading} onClick={handleClick}>
      Quit
    </Button>
  );
};

export default LeaveGameButton;
