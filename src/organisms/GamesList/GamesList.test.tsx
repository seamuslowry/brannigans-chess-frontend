import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GamesList from './GamesList';
import { Game } from '../../services/ChessService.types';
import { emptyGame } from '../../utils/testData';

const games: Game[] = [emptyGame, { ...emptyGame, id: 2 }];

test('renders games as a list', async () => {
  render(
    <MemoryRouter>
      <GamesList games={games} />
    </MemoryRouter>
  );

  const gameNodes = await waitFor(() => screen.getAllByTestId('game-list-item'));

  expect(gameNodes).toHaveLength(2);
});

test('displays error when provided', async () => {
  const errorText = 'error';

  render(<GamesList games={[]} error={errorText} />);

  const error = await waitFor(() => screen.getByText(/Could not load games/i));
  const games = screen.queryAllByTestId(/game-list-item/i);

  expect(error.textContent).toContain(errorText);
  expect(games).toHaveLength(0);
});

test('shows a message when there are no matching games', async () => {
  render(<GamesList games={[]} />);

  const message = await waitFor(() => screen.getByText('No matching games'));

  expect(message).toBeInTheDocument();
});
