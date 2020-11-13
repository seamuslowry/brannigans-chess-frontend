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
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import GamesList from './GamesList';
import { Game, PageResponse } from '../../services/ChessService.types';
import config from '../../config';
import { emptyGame, testStore } from '../../utils/testData';
import { AppState } from '../../store/store';

const gamesResponse: Game[] = [emptyGame, { ...emptyGame, id: 2 }];
const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

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

test('defaults to active games', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <MemoryRouter>
        <GamesList />
      </MemoryRouter>
    </Provider>
  );

  const activeButtonLabel = await waitFor(() => getByText('Active'));
  const inactiveButtonLabel = await waitFor(() => getByText('Inactive'));
  const openButtonLabel = await waitFor(() => getByText('Open'));

  // MUI default button secondary color
  expect(activeButtonLabel.parentElement).toHaveStyle('background-color: rgb(245, 0, 87)');
  expect(inactiveButtonLabel.parentElement).not.toHaveStyle('background-color: rgb(245, 0, 87)');
  expect(openButtonLabel.parentElement).not.toHaveStyle('background-color: rgb(245, 0, 87)');
});

test('selects open games', async () => {
  const { getByText, getAllByRole } = render(
    <Provider store={mockedStore}>
      <MemoryRouter>
        <GamesList />
      </MemoryRouter>
    </Provider>
  );

  const activeButtonLabel = await waitFor(() => getByText('Active'));
  const inactiveButtonLabel = await waitFor(() => getByText('Inactive'));
  const openButtonLabel = await waitFor(() => getByText('Open'));

  fireEvent.click(openButtonLabel);

  await waitForElementToBeRemoved(() => getAllByRole('progressbar')); // wait for service calls to complete

  // MUI default button secondary color
  expect(activeButtonLabel.parentElement).not.toHaveStyle('background-color: rgb(245, 0, 87)');
  expect(inactiveButtonLabel.parentElement).not.toHaveStyle('background-color: rgb(245, 0, 87)');
  expect(openButtonLabel.parentElement).toHaveStyle('background-color: rgb(245, 0, 87)');
});

test('selects inactive games', async () => {
  const { getByText, getAllByRole } = render(
    <Provider store={mockedStore}>
      <MemoryRouter>
        <GamesList />
      </MemoryRouter>
    </Provider>
  );

  const activeButtonLabel = await waitFor(() => getByText('Active'));
  const inactiveButtonLabel = await waitFor(() => getByText('Inactive'));
  const openButtonLabel = await waitFor(() => getByText('Open'));

  fireEvent.click(inactiveButtonLabel);

  await waitForElementToBeRemoved(() => getAllByRole('progressbar')); // wait for service calls to complete

  // MUI default button secondary color
  expect(activeButtonLabel.parentElement).not.toHaveStyle('background-color: rgb(245, 0, 87)');
  expect(inactiveButtonLabel.parentElement).toHaveStyle('background-color: rgb(245, 0, 87)');
  expect(openButtonLabel.parentElement).not.toHaveStyle('background-color: rgb(245, 0, 87)');
});
