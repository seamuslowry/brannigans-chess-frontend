import { ActionCreator, AnyAction } from 'redux';
import thunk from 'redux-thunk';
import createMockStore from 'redux-mock-store';
import { LOGIN, loginOnce, logout, reducer, updateToken, UPDATE_TOKEN, initialState } from './auth';
import { loginResponse, testStore } from '../../utils/testData';
import { AppState } from '../store';
import { login } from './auth.thunk';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());
beforeEach(() => jest.clearAllMocks());

test('performs the initial login', () => {
  const result = reducer(undefined, loginOnce(loginResponse));

  expect(loginResponse.getAuthResponse).toHaveBeenCalled();
  expect(result.user).not.toBeUndefined();
});

test('updates the access token', () => {
  const token = 'new-token';
  const result = reducer(undefined, updateToken(token));

  expect(result.token).toEqual(token);
});

test('logs out', () => {
  const result = reducer(undefined, logout());

  expect(result).toEqual(initialState);
});

test('logs in and refreshes', async () => {
  jest.useFakeTimers();
  mockedStore.dispatch(login(loginResponse));

  jest.runAllTimers();
  await Promise.resolve(); // wait for queue to run

  expect(loginResponse.reloadAuthResponse).toHaveBeenCalled();
  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: UPDATE_TOKEN
    })
  );
  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: LOGIN
    })
  );
});
