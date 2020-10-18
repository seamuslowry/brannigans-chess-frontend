import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { act } from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import GamesList from './GamesList';
import { Game, PageResponse } from '../../services/ChessService';
import config from '../../config';
import { emptyGame, testStore } from '../../utils/testData';
import { AppState } from '../../store/store';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

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
  render(
    <Provider store={mockedStore}>
      <MemoryRouter>
        <GamesList />
      </MemoryRouter>
    </Provider>
  );

  const gameNodes = await waitFor(() => screen.getAllByTestId('game-list-item'));

  expect(gameNodes).toHaveLength(2);
});

test('handles error when getting lists', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/games`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(
    <Provider store={mockedStore}>
      <GamesList />
    </Provider>
  );

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

  render(
    <Provider store={mockedStore}>
      <GamesList />
    </Provider>
  );

  const message = await waitFor(() => screen.getByText('No available games'));

  expect(message).toBeInTheDocument();
});

test('handles a page change', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <MemoryRouter>
        <GamesList />
      </MemoryRouter>
    </Provider>
  );

  let pageTwo = await waitFor(() => getByText('2'));

  await act(async () => {
    fireEvent.click(pageTwo);
  });

  pageTwo = await waitFor(() => getByText('2'));

  expect(pageTwo.className).toContain('selected');
});
