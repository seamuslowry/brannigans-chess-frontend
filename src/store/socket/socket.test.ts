import {
  STOMP_CLOSED,
  STOMP_CONNECTED,
  STOMP_MESSAGE,
  MessagePayload
} from '../middleware/stomp/stomp';
import reducer from './socket';

test('marks as connected', () => {
  const result = reducer(undefined, { type: STOMP_CONNECTED });

  expect(result.connected).toEqual(true);
});

test('marks as disconnected', () => {
  const result = reducer(undefined, { type: STOMP_CLOSED });

  expect(result.connected).toEqual(false);
});

test('receives a message', () => {
  const message: MessagePayload = { topic: 'topic/1', data: 'topic1data' };

  const result = reducer(undefined, {
    type: STOMP_MESSAGE,
    payload: message
  });

  expect(result.messages).toContainEqual(message);
});
