import React from 'react';
import { useSelector } from 'react-redux';
import { MessagePayload, subscribe, unsubscribe } from '../store/middleware/stomp/stomp';
import { AppState, useAppDispatch } from '../store/store';

const useSubscription = (topic: string) => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(subscribe(topic));

    return () => {
      dispatch(unsubscribe(topic));
    };
  }, [topic, dispatch]);

  return useSelector<AppState, MessagePayload[]>(state =>
    state.socket.messages.filter(m => m.topic === topic)
  );
};

export default useSubscription;
