import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { UseGoogleLogoutProps } from 'react-google-login';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import { AppState } from '../../store/store';
import { testStore } from '../../utils/testData';
import Logout from './Logout';
import { logout } from '../../store/auth/auth';
import { SEND_ALERT } from '../../store/notifications/notifications';

let successHandler: VoidFunction | undefined;
let failureHandler: VoidFunction | undefined;
const mockedReturn = {
  signOut: jest.fn()
};

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

jest.mock('react-google-login', () => ({
  useGoogleLogout: jest.fn().mockImplementation((args: UseGoogleLogoutProps) => {
    successHandler = args.onLogoutSuccess;
    failureHandler = args.onFailure;

    return mockedReturn;
  })
}));

beforeEach(() => mockedStore.clearActions());
beforeEach(() => jest.clearAllMocks());

test('attempts to log out on click', () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <Logout />
    </Provider>
  );
  const button = getByText('Logout');
  fireEvent.click(button);

  expect(mockedReturn.signOut).toHaveBeenCalled();
});

test('successfully logs out', () => {
  render(
    <MemoryRouter>
      <Provider store={mockedStore}>
        <Logout />
      </Provider>
    </MemoryRouter>
  );

  successHandler && successHandler();

  expect(mockedStore.getActions()).toContainEqual(expect.objectContaining(logout()));
});

test('fails to logs out', () => {
  render(
    <MemoryRouter>
      <Provider store={mockedStore}>
        <Logout />
      </Provider>
    </MemoryRouter>
  );

  failureHandler && failureHandler();

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: SEND_ALERT
    })
  );
});
