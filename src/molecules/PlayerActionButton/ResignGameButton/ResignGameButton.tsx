import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';
import { useAppDispatch } from '../../../store/store';
import { resignGame } from '../../../store/games/games';

interface Props {
  gameId: number;
}

const ResignGameButton: React.FC<Omit<ButtonProps, 'disabled' | 'onClick'> & Props> = ({
  gameId,
  ...rest
}) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = React.useState(false);

  const handleClick = () => {
    setLoading(true);
    dispatch(resignGame(gameId)).finally(() => setLoading(false));
  };

  return (
    <Button {...rest} data-testid="resign-game-button" disabled={loading} onClick={handleClick}>
      Resign
    </Button>
  );
};

export default ResignGameButton;
