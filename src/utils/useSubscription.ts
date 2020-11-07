import React from 'react';
import { useSelector } from 'react-redux';
import { MessagePayload, subscribe, unsubscribe } from '../store/middleware/stomp/stomp';
import { makeGetTopicMessages } from '../store/socket/socket';
import { AppState, useAppDispatch } from '../store/store';

const useSubscription = (topic: string) => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(subscribe(topic));

    return () => {
      dispatch(unsubscribe(topic));
    };
  }, [topic, dispatch]);

  const getTopicMessages = React.useMemo(makeGetTopicMessages, []);
  return useSelector<AppState, MessagePayload[]>(state => getTopicMessages(state, topic));
};

export default useSubscription;
