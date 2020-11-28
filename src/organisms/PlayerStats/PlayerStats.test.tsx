import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { PlayerStatInfo } from '../../services/ChessService.types';
import config from '../../config';
import { playerOne, statData } from '../../utils/testData';
import PlayerStats from './PlayerStats';

const server = setupServer(
  rest.get(`${config.serviceUrl}/players/stats/${playerOne.authId}`, (req, res, ctx) => {
    return res(ctx.json<PlayerStatInfo>(statData));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders player stats', async () => {
  const { getByLabelText, getByRole } = render(<PlayerStats player={playerOne} />);

  await waitForElementToBeRemoved(() => getByRole('progressbar'));

  expect(getByLabelText('TOTAL GAMES')).toHaveTextContent('250');
  expect(getByLabelText('TOTAL WINS')).toHaveTextContent('135');
  expect(getByLabelText('WIN PERCENTAGE')).toHaveTextContent('54%');
  expect(getByLabelText('TOTAL DRAWS')).toHaveTextContent('70');
  expect(getByLabelText('DRAW PERCENTAGE')).toHaveTextContent('28%');

  expect(getByLabelText('WHITE GAMES')).toHaveTextContent('100');
  expect(getByLabelText('WHITE WINS')).toHaveTextContent('60');
  expect(getByLabelText('WHITE WIN PERCENTAGE')).toHaveTextContent('60%');
  expect(getByLabelText('WHITE DRAWS')).toHaveTextContent('20');
  expect(getByLabelText('WHITE DRAW PERCENTAGE')).toHaveTextContent('20%');

  expect(getByLabelText('BLACK GAMES')).toHaveTextContent('150');
  expect(getByLabelText('BLACK WINS')).toHaveTextContent('75');
  expect(getByLabelText('BLACK WIN PERCENTAGE')).toHaveTextContent('50%');
  expect(getByLabelText('BLACK DRAWS')).toHaveTextContent('50');
  expect(getByLabelText('BLACK DRAW PERCENTAGE')).toHaveTextContent('33.33%');
});

test('handles an error', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/players/stats/${playerOne.authId}`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const { getByText, getByRole } = render(<PlayerStats player={playerOne} />);

  await waitForElementToBeRemoved(() => getByRole('progressbar'));

  expect(getByText(/Could not load stats/i)).toBeInTheDocument();
});
