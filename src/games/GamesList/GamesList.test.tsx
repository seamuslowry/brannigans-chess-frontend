import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import GamesList from './GamesList';
import { Game } from '../../services/ChessService';
import config from '../../config';

const gamesResponse: Game[] = [
  { id: 1, uuid: 'uuid1', whitePlayer: null, blackPlayer: null, winner: null },
  { id: 2, uuid: 'uuid2', whitePlayer: null, blackPlayer: null, winner: null }
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

  const gameNodes = await waitFor(() => screen.getAllByTestId('game-list-item'));

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

test('allows users to join as white or black when available', async () => {
  render(<GamesList />);

  const joinNodes = await waitFor(() => screen.getAllByTitle(/join as/i));

  expect(joinNodes).toHaveLength(gamesResponse.length * 2);
});

test('disallows joining when both colors are unavailable', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/games?active=true`, (req, res, ctx) => {
      return res(
        ctx.json<Game[]>([
          {
            uuid: 'uuid filled',
            id: 3,
            whitePlayer: { username: 'test', email: 'test', id: 1 },
            blackPlayer: { username: 'test2', email: 'test2', id: 2 },
            winner: null
          }
        ])
      );
    })
  );
  render(<GamesList />);

  const joinNodes = await waitFor(() => screen.getAllByTitle(/is playing/i));

  expect(joinNodes).toHaveLength(2);
});
