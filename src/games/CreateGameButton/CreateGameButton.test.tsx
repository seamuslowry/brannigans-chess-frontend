import React from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { createMemoryHistory } from 'history';
import config from '../../config';
import { Game } from '../../services/ChessService';
import { emptyGame, testStore } from '../../utils/testData';
import CreateGameButton from './CreateGameButton';
import { Router } from 'react-router-dom';
import { ActionCreator } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppState } from '../../store/store';
import { Provider } from 'react-redux';
import { SEND_ALERT } from '../../store/notifications/notifications';

const mockStore = createMockStore<AppState, ActionCreator<any>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.post(`${config.serviceUrl}/games/create`, (req, res, ctx) => {
    return res(ctx.json<Game>(emptyGame));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders a button', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <CreateGameButton />
    </Provider>
  );

  const button = await waitFor(() => getByText('Create Game'));

  expect(button).toBeInTheDocument();
});

test('creates a game', async () => {
  const history = createMemoryHistory();
  const { getByText } = render(
    <Router history={history}>
      <Provider store={mockedStore}>
        <CreateGameButton />
      </Provider>
    </Router>
  );

  let button = await waitFor(() => getByText('Create Game'));
  fireEvent.click(button);
  button = await waitFor(() => getByText('Create Game')); // wait for call to complete

  expect(history.entries).toContainEqual(
    expect.objectContaining({ pathname: `/game/${emptyGame.id}` })
  );
});

test('fails to create a game', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/games/create`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  const history = createMemoryHistory();
  const { getByText } = render(
    <Router history={history}>
      <Provider store={mockedStore}>
        <CreateGameButton />
      </Provider>
    </Router>
  );

  let button = await waitFor(() => getByText('Create Game'));
  fireEvent.click(button);
  button = await waitFor(() => getByText('Create Game')); // wait for call to complete

  expect(history.entries).not.toContainEqual(
    expect.objectContaining({ pathname: `/game/${emptyGame.id}` })
  );
  expect(mockedStore.getActions()).toContainEqual(expect.objectContaining({ type: SEND_ALERT }));
});