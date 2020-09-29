import React from 'react';
import { fireEvent, waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { createMemoryHistory } from 'history';
import config from '../../config';
import { Game } from '../../services/ChessService';
import { emptyGame } from '../../utils/testData';
import CreateGameButton from './CreateGameButton';
import { Router } from 'react-router-dom';

const server = setupServer(
  rest.post(`${config.serviceUrl}/games/create`, (req, res, ctx) => {
    return res(ctx.json<Game>(emptyGame));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders a button', async () => {
  const { getByText } = render(<CreateGameButton />);

  const button = await waitFor(() => getByText('Create Game'));

  expect(button).toBeInTheDocument();
});

test('creates a game', async () => {
  const history = createMemoryHistory();
  const { getByText } = render(
    <Router history={history}>
      <CreateGameButton />
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
      <CreateGameButton />
    </Router>
  );

  let button = await waitFor(() => getByText('Create Game'));
  fireEvent.click(button);
  button = await waitFor(() => getByText('Create Game')); // wait for call to complete

  expect(history.entries).not.toContainEqual(
    expect.objectContaining({ pathname: `/game/${emptyGame.id}` })
  );
});
