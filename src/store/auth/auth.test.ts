import { ActionCreator, AnyAction } from 'redux';
import thunk from 'redux-thunk';
import createMockStore from 'redux-mock-store';
import { reducer, updateToken, updatePlayer } from './auth';
import { playerOne, testStore } from '../../utils/testData';
import { AppState } from '../store';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());
beforeEach(() => jest.clearAllMocks());

test('updates the access token', () => {
  const token = 'new-token';
  const result = reducer(undefined, updateToken(token));

  expect(result.token).toEqual(token);
});

test('updates the player', () => {
  const result = reducer(undefined, updatePlayer(playerOne));

  expect(result.player).toEqual(playerOne);
});
