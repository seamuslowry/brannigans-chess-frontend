import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import GamesList from './GamesList';
import { Game, PageResponse } from '../../services/ChessService';
import config from '../../config';
import { act } from 'react-test-renderer';
import { emptyGame } from '../../utils/testData';

const gamesResponse: Game[] = [emptyGame, { ...emptyGame, id: 2 }];

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
  const games = screen.queryAllByTestId(/game-list-item/i);

  expect(error).toBeInTheDocument();
  expect(games).toHaveLength(0);
});

test('shows a message when there are no available games', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/games`, (req, res, ctx) => {
      return res(
        ctx.json<PageResponse<Game>>({ content: [], totalElements: 0, totalPages: 0 })
      );
    })
  );

  render(<GamesList />);

  const message = await waitFor(() => screen.getByText('No available games'));

  expect(message).toBeInTheDocument();
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
