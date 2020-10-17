import React from 'react';
import { Box, CircularProgress, Paper, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import startCase from 'lodash.startcase';
import { subscribe, unsubscribe } from '../../store/middleware/stomp/stomp';
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
    <Paper>
      <Box width="100%" p={2}>
        {!gameStatus && <CircularProgress />}
        {gameStatus && (
          <>
            <Typography display="inline" color="secondary">
              STATUS:{' '}
            </Typography>
            <Typography display="inline">{startCase(gameStatus.toLowerCase())}</Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default GameStatus;
