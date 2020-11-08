import React from 'react';
import { fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import config from '../../config';
import { Game } from '../../services/ChessService.types';
import { emptyGame, testStore } from '../../utils/testData';
import CreateGameButton from './CreateGameButton';
import { AppState } from '../../store/store';
import { createGame } from '../../store/games/games';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
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
  const { getByText, getByRole } = render(
    <Router history={history}>
      <Provider store={mockedStore}>
        <CreateGameButton />
      </Provider>
    </Router>
  );

  const button = await waitFor(() => getByText('Create Game'));
  fireEvent.click(button);
  await waitFor(() => expect(history.location.pathname).toEqual(`/game/${emptyGame.id}`));
});

test('fails to create a game', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/games/create`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  const history = createMemoryHistory();
  const { getByText, getByRole } = render(
    <Router history={history}>
      <Provider store={mockedStore}>
        <CreateGameButton />
      </Provider>
    </Router>
  );

  const button = await waitFor(() => getByText('Create Game'));
  fireEvent.click(button);
  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for call to complete

  expect(history.location.pathname).not.toEqual(`/game/${emptyGame.id}`);
  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({ type: createGame.rejected.type })
  );
});
