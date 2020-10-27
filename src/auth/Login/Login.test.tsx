import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import { GoogleLoginResponseOffline, UseGoogleLoginProps } from 'react-google-login';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppState } from '../../store/store';
import { testStore } from '../../utils/testData';
import { GoogleLoginRequired } from '../../store/auth/auth';
import Login from './Login';

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

test('opens the authentication dialog', async () => {
  const id = 'test-id';
  const { getByTestId, queryByRole } = render(
    <Provider store={mockedStore}>
      <Login data-testid={id} />
    </Provider>
  );

  expect(queryByRole('presentation')).toBeNull();

  const button = getByTestId(id);
  fireEvent.click(button);

  expect(queryByRole('presentation')).not.toBeNull();
});

test('closes the authentication dialog', async () => {
  const id = 'test-id';

  const { getByTestId, queryByRole, getByLabelText } = render(
    <Provider store={mockedStore}>
      <Login data-testid={id} />
    </Provider>
  );

  const button = getByTestId(id);
  fireEvent.click(button);

  expect(queryByRole('presentation')).not.toBeNull();

  fireEvent.click(getByLabelText('close'));

  await waitForElementToBeRemoved(() => queryByRole('presentation'));
});
