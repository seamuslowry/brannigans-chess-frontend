import { ActionCreator, AnyAction } from 'redux';
import thunk from 'redux-thunk';
import createMockStore from 'redux-mock-store';
import {
  LOGIN,
  loginOnce,
  logout,
  reducer,
  updateToken,
  UPDATE_TOKEN,
  initialState,
  UPDATE_PLAYER
} from './auth';
import { loginResponse, playerOne, testStore } from '../../utils/testData';
import { AppState } from '../store';
import { googleLogin, googleSignup } from './auth.thunk';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Player } from '../../services/ChessService.types';
import config from '../../config';
import { waitFor } from '@testing-library/dom';

const server = setupServer(
  rest.get(`${config.serviceUrl}/players/login/google`, (req, res, ctx) => {
    return res(ctx.json<Player>(playerOne));
  }),
  rest.put(`${config.serviceUrl}/players/signup/google`, (req, res, ctx) => {
    return res(ctx.json<Player>(playerOne));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());
beforeEach(() => jest.clearAllMocks());

const testTimeout = setTimeout(jest.fn(), 0);

test('performs the initial login', () => {
  const result = reducer(undefined, loginOnce(loginResponse, testTimeout));

  expect(result.user).not.toBeUndefined();
  expect(result.token).toEqual(loginResponse.tokenId);
});

test('updates the access token', () => {
  const token = 'new-token';
  const result = reducer(undefined, updateToken(token, testTimeout));

  expect(result.token).toEqual(token);
});

test('logs out', () => {
  const result = reducer(undefined, logout());

  expect(result).toEqual(initialState);
});

test('logs in and refreshes', async () => {
  jest.useFakeTimers();
  await waitFor(() => mockedStore.dispatch(googleLogin(loginResponse)));

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
  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: UPDATE_PLAYER
    })
  );
});

test('signs up and refreshes', async () => {
  jest.useFakeTimers();
  await waitFor(() => mockedStore.dispatch(googleSignup(loginResponse)));

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
  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: UPDATE_PLAYER
    })
  );
});
