import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import GamesList from './GamesList';
import { Game } from '../../services/ChessService';
import config from '../../config';

const gamesResponse: Game[] = [
  { id: 1, uuid: 'uuid1' },
  { id: 2, uuid: 'uuid2' }
];

const server = setupServer(
  rest.get(`${config.serviceUrl}/games?active=true`, (req, res, ctx) => {
    return res(ctx.json<Game[]>(gamesResponse));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders games as a list', async () => {
  render(<GamesList />);

  const gameNodes = await waitFor(() => screen.getAllByText(/Game Id/i));

  expect(gameNodes).toHaveLength(2);
});

test('handles error when getting lists', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/games?active=true`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<GamesList />);

  const error = await waitFor(() => screen.getByText(/Could not load game/i));

  expect(error).toBeInTheDocument();
});
