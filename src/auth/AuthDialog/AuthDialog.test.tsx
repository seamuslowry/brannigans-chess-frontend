import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import thunk from 'redux-thunk';
import { testStore, whiteMove } from '../../utils/testData';
import { Move } from '../../services/ChessService.types';
import config from '../../config';
import AuthDialog from './AuthDialog';
import { SET_TILE } from '../../store/activeGame/activeGame';
import { immutableUpdate } from '../../utils/arrayHelpers';
import { SEND_ALERT } from '../../store/notifications/notifications';

const mockStore = createMockStore([thunk]);
const mockedStore = mockStore({
  ...testStore,
  activeGame: {
    ...testStore.activeGame
  }
});

const server = setupServer(
  rest.post(`${config.serviceUrl}/pieces/promote/QUEEN`, (req, res, ctx) => {
    return res(
      ctx.json<Move[]>([whiteMove])
    );
  })
);

beforeEach(() => mockedStore.clearActions());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('opens as signup', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <AuthDialog variant="signup" open onClose={jest.fn()} />
    </Provider>
  );

  expect(getByText('Signup')).toBeInTheDocument();
});

test('opens as login', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <AuthDialog variant="login" open onClose={jest.fn()} />
    </Provider>
  );

  expect(getByText('Login')).toBeInTheDocument();
});
