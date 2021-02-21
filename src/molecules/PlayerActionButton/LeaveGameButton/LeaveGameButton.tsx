import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { PieceColor } from '../../../services/ChessService.types';
import { useAppDispatch } from '../../../store/store';
import { leaveGame } from '../../../store/games/games';

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
