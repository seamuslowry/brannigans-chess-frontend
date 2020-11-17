import React from 'react';
import {
  render,
  waitFor,
  screen,
  fireEvent,
  act,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter } from 'react-router-dom';
import PlayerGames from './PlayerGames';
import { Game, PageResponse } from '../../services/ChessService.types';
import config from '../../config';
import { emptyGame, playerOne } from '../../utils/testData';

const gamesResponse: Game[] = [emptyGame, { ...emptyGame, id: 2 }];

const server = setupServer(
  rest.get(`${config.serviceUrl}/players/games`, (req, res, ctx) => {
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
  render(
    <MemoryRouter>
      <PlayerGames player={playerOne} />
    </MemoryRouter>
  );

  const gameNodes = await waitFor(() => screen.getAllByTestId('game-list-item'));

  expect(gameNodes).toHaveLength(2);
});

test('handles error when getting lists', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/players/games`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<PlayerGames player={playerOne} />);

  const error = await waitFor(() => screen.getByText(/Could not load game/i));
  const games = screen.queryAllByTestId(/game-list-item/i);

  expect(error).toBeInTheDocument();
  expect(games).toHaveLength(0);
});

test('handles a page change', async () => {
  const { getByText } = render(
    <MemoryRouter>
      <PlayerGames player={playerOne} />
    </MemoryRouter>
  );

  let pageTwo = await waitFor(() => getByText('2'));

  await act(async () => {
    fireEvent.click(pageTwo);
  });

  pageTwo = await waitFor(() => getByText('2'));

  expect(pageTwo.className).toContain('selected');
});

test('defaults to active games', async () => {
  const { getByText } = render(
    <MemoryRouter>
      <PlayerGames player={playerOne} />
    </MemoryRouter>
  );

  const activeButtonLabel = await waitFor(() => getByText('Active'));
  const openButtonLabel = await waitFor(() => getByText('Open'));
  const completeButtonLabel = await waitFor(() => getByText('Complete'));

  expect(completeButtonLabel.parentElement).toHaveAttribute('aria-selected', 'false');
  expect(openButtonLabel.parentElement).toHaveAttribute('aria-selected', 'false');
  expect(activeButtonLabel.parentElement).toHaveAttribute('aria-selected', 'true');
});

test('selects open games', async () => {
  const { getByText, getByRole } = render(
    <MemoryRouter>
      <PlayerGames player={playerOne} />
    </MemoryRouter>
  );

  const activeButtonLabel = await waitFor(() => getByText('Active'));
  const openButtonLabel = await waitFor(() => getByText('Open'));
  const completeButtonLabel = await waitFor(() => getByText('Complete'));

  fireEvent.click(openButtonLabel);

  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for service calls to complete

  expect(completeButtonLabel.parentElement).toHaveAttribute('aria-selected', 'false');
  expect(openButtonLabel.parentElement).toHaveAttribute('aria-selected', 'true');
  expect(activeButtonLabel.parentElement).toHaveAttribute('aria-selected', 'false');
});

test('selects complete games', async () => {
  const { getByText, getAllByRole } = render(
    <MemoryRouter>
      <PlayerGames player={playerOne} />
    </MemoryRouter>
  );

  const activeButtonLabel = await waitFor(() => getByText('Active'));
  const openButtonLabel = await waitFor(() => getByText('Open'));
  const completeButtonLabel = await waitFor(() => getByText('Complete'));

  fireEvent.click(completeButtonLabel);

  await waitForElementToBeRemoved(() => getAllByRole('progressbar')); // wait for service calls to complete

  expect(completeButtonLabel.parentElement).toHaveAttribute('aria-selected', 'true');
  expect(openButtonLabel.parentElement).toHaveAttribute('aria-selected', 'false');
  expect(activeButtonLabel.parentElement).toHaveAttribute('aria-selected', 'false');
});
