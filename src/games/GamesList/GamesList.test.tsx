import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import GamesList from './GamesList';
import { Game, PageResponse } from '../../services/ChessService';
import config from '../../config';
import { act } from 'react-test-renderer';

const gamesResponse: Game[] = [
  { id: 1, uuid: 'uuid1', whitePlayer: null, blackPlayer: null, winner: null },
  { id: 2, uuid: 'uuid2', whitePlayer: null, blackPlayer: null, winner: null }
];

const server = setupServer(
  rest.get(`${config.serviceUrl}/games`, (req, res, ctx) => {
    return res(
      ctx.json<PageResponse<Game>>({
        content: gamesResponse,
        totalPages: 2,
        totalElements: gamesResponse.length
      })
    );
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
    rest.get(`${config.serviceUrl}/games`, (req, res, ctx) => {
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
    rest.get(`${config.serviceUrl}/games`, (req, res, ctx) => {
      return res(
        ctx.json<PageResponse<Game>>({
          content: [
            {
              uuid: 'uuid filled',
              id: 3,
              whitePlayer: { username: 'test', email: 'test', id: 1 },
              blackPlayer: { username: 'test2', email: 'test2', id: 2 },
              winner: null
            }
          ],
          totalElements: 1,
          totalPages: 1
        })
      );
    })
  );
  render(<GamesList />);

  const joinNodes = await waitFor(() => screen.getAllByTitle(/is playing/i));

  expect(joinNodes).toHaveLength(2);
});

test('handles a page change', async () => {
  const { getByText } = render(<GamesList />);

  let pageTwo = await waitFor(() => getByText('2'));

  await act(async () => {
    fireEvent.click(pageTwo);
  });

  pageTwo = await waitFor(() => getByText('2'));

  expect(pageTwo.className).toContain('selected');
});
