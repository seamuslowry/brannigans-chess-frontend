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
import AuthenticateWithGoogle from './AuthenticateWithGoogle';
import { GoogleLoginRequired, LOGIN, logout } from '../../store/auth/auth';
import { SEND_ALERT } from '../../store/notifications/notifications';

let successHandler:
  | ((response: GoogleLoginRequired | GoogleLoginResponseOffline) => void)
  | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failureHandler: ((e?: any) => void) | undefined;
const mockedReturn = {
  signIn: jest.fn(),
  loaded: true
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
      <AuthenticateWithGoogle authVariant="login">Continue with Google</AuthenticateWithGoogle>
    </Provider>
  );
  const button = getByText('Continue with Google');
  fireEvent.click(button);

  expect(mockedReturn.signIn).toHaveBeenCalled();
});

test('attempts to sign up on click', () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <AuthenticateWithGoogle authVariant="signup">Continue with Google</AuthenticateWithGoogle>
    </Provider>
  );
  const button = getByText('Continue with Google');
  fireEvent.click(button);

  expect(mockedReturn.signIn).toHaveBeenCalled();
});

test('successfully logs in when not offline', () => {
  render(
    <MemoryRouter>
      <Provider store={mockedStore}>
        <AuthenticateWithGoogle authVariant="login">Continue with Google</AuthenticateWithGoogle>
      </Provider>
    </MemoryRouter>
  );

  successHandler && successHandler(loginResponse);

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: LOGIN
    })
  );
});

test('attempts to log in when offline', () => {
  render(
    <MemoryRouter>
      <Provider store={mockedStore}>
        <AuthenticateWithGoogle authVariant="login">Continue with Google</AuthenticateWithGoogle>
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
        <AuthenticateWithGoogle authVariant="login">Continue with Google</AuthenticateWithGoogle>
      </Provider>
    </MemoryRouter>
  );

  failureHandler && failureHandler();

  expect(mockedStore.getActions()).toContainEqual(expect.objectContaining(logout()));
});
