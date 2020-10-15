import React from 'react';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { subscribe, unsubscribe } from '../../store/middleware/stomp';
import { AppState } from '../../store/store';
import { Message } from '../../store/socket/socket';

interface Props {
  gameId: number;
}

const GameStatus: React.FC<Props> = ({ gameId }) => {
  const topic = `/game/status/${gameId}`;
  const statusMessages = useSelector<AppState, Message[]>(state =>
    state.socket.messages.filter(m => m.topic === topic)
  );

  const gameStatus = !!statusMessages.length && statusMessages[statusMessages.length - 1].data;

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(subscribe(topic));

    return () => {
      dispatch(unsubscribe(topic));
    };
  }, [topic, dispatch]);

  return (
    <Box width="100%">
      {!gameStatus && <CircularProgress />}
      {gameStatus && <Typography>{gameStatus}</Typography>}
    </Box>
  );
};

export default GameStatus;
