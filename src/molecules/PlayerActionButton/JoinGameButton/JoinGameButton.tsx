import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { PieceColor } from '../../../services/ChessService.types';
import { useAppDispatch } from '../../../store/store';
import { joinGame } from '../../../store/games/games';

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

  const handleClick = () => {
    setLoading(true);
    dispatch(joinGame({ gameId, pieceColor })).finally(() => setLoading(false));
  };

  return (
    <Button data-testid="join-game-button" {...rest} disabled={loading} onClick={handleClick}>
      Play
    </Button>
  );
};

export default JoinGameButton;
