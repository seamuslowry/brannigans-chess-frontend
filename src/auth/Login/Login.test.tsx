import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { GoogleLoginResponseOffline, UseGoogleLoginProps } from 'react-google-login';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import { AppState } from '../../store/store';
import { loginResponse, testStore } from '../../utils/testData';
import Login from './Login';
import { GoogleLoginRequired, loginOnce, logout } from '../../store/auth/auth';
import { SEND_ALERT } from '../../store/notifications/notifications';

let successHandler:
  | ((response: GoogleLoginRequired | GoogleLoginResponseOffline) => void)
  | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failureHandler: ((e?: any) => void) | undefined;
const mockedReturn = {
  signIn: jest.fn()
};

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

jest.mock('react-google-login', () => ({
  useGoogleLogin: jest.fn().mockImplementation((args: UseGoogleLoginProps) => {
    // @ts-ignore
    successHandler = args.onSuccess;
    failureHandler = args.onFailure;

    return mockedReturn;
  })
}));

beforeEach(() => mockedStore.clearActions());
beforeEach(() => jest.clearAllMocks());

test('attempts to log in on click', () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <Login />
    </Provider>
  );
  const button = getByText('Login');
  fireEvent.click(button);

  expect(mockedReturn.signIn).toHaveBeenCalled();
});

test('successfully logs in when not offline', () => {
  render(
    <MemoryRouter>
      <Provider store={mockedStore}>
        <Login />
      </Provider>
    </MemoryRouter>
  );

  successHandler && successHandler(loginResponse);

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining(loginOnce(loginResponse))
  );
});

test('attempts to log in when offline', () => {
  render(
    <MemoryRouter>
      <Provider store={mockedStore}>
        <Login />
      </Provider>
    </MemoryRouter>
  );

  successHandler && successHandler({ code: 'test' });

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: SEND_ALERT
    })
  );
});

test('fails to logs in', () => {
  render(
    <MemoryRouter>
      <Provider store={mockedStore}>
        <Login />
      </Provider>
    </MemoryRouter>
  );

  failureHandler && failureHandler();

  expect(mockedStore.getActions()).toContainEqual(expect.objectContaining(logout()));
});
