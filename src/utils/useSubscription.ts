import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribe, unsubscribe } from '../store/middleware/stomp/stomp';
import { Message } from '../store/socket/socket';
import { AppState } from '../store/store';

const useSubscription = (topic: string) => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(subscribe(topic));

    return () => {
      dispatch(unsubscribe(topic));
    };
  }, [topic, dispatch]);

  return useSelector<AppState, Message[]>(state =>
    state.socket.messages.filter(m => m.topic === topic)
  );
};

export default useSubscription;
