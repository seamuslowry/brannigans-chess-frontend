import React from 'react';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';
import { Game } from './services/ChessService';

const server = setupServer(
  rest.get('/games', (req, res, ctx) => {
    return res(ctx.json<Game[]>([]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders the insirational quote', () => {
  const { getByText } = render(<App />);
  const quote = getByText(/never let your adversary see your pieces/i);
  expect(quote).toBeInTheDocument();
});
