import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { emptyGame, mockEntityAdapterState, playerOne, testStore } from '../../utils/testData';
import { Piece } from '../../services/ChessService.types';
import config from '../../config';
import Board from './Board';

const mockStore = createMockStore(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

const server = setupServer(
  rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
    return res(ctx.json<Piece[]>([]));
  })
);

beforeEach(() => mockedStore.clearActions());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders 64 tiles', async () => {
  const { getAllByTestId, unmount } = render(
    <Provider store={mockedStore}>
      <Board gameId={0} />
    </Provider>
  );

  const tiles = getAllByTestId(/tile-/i);

  expect(tiles).toHaveLength(64);
  unmount();
});

test('renders for someone playing white', async () => {
  const whitePlayerStore = mockStore({
    ...testStore,
    auth: {
      player: playerOne
    },
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 0,
      whitePlayer: playerOne
    })
  });
  const { getAllByTestId, getByTestId, unmount } = render(
    <Provider store={whitePlayerStore}>
      <Board gameId={0} />
    </Provider>
  );

  const tiles = getAllByTestId(/tile-/i);
  const blackRookTile = getByTestId('tile-0-0');

  expect(tiles).toHaveLength(64);
  expect(tiles[0].isSameNode(blackRookTile)).toBeTruthy();
  unmount();
});

test('renders for someone playing black', async () => {
  const blackPlayerStore = mockStore({
    ...testStore,
    auth: {
      player: playerOne
    },
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 0,
      blackPlayer: playerOne
    })
  });

  const { getAllByTestId, getByTestId, unmount } = render(
    <Provider store={blackPlayerStore}>
      <Board gameId={0} />
    </Provider>
  );

  const tiles = getAllByTestId(/tile-/i);
  const whiteRookTile = getByTestId('tile-7-0');

  expect(tiles).toHaveLength(64);
  expect(tiles[0].isSameNode(whiteRookTile)).toBeTruthy();
  unmount();
});

test('renders for someone spectating', async () => {
  const spectatorStore = mockStore({
    ...testStore,
    auth: {
      player: playerOne
    },
    games: mockEntityAdapterState({
      ...emptyGame,
      id: 0
    })
  });
  const { getAllByTestId, getByTestId, unmount } = render(
    <Provider store={spectatorStore}>
      <Board gameId={0} />
    </Provider>
  );

  const tiles = getAllByTestId(/tile-/i);
  const blackRookTile = getByTestId('tile-0-0');

  expect(tiles).toHaveLength(64);
  expect(tiles[0].isSameNode(blackRookTile)).toBeTruthy();
  unmount();
});

test('renders for someone while the game is not in data', async () => {
  const spectatorStore = mockStore({
    ...testStore,
    auth: {
      player: playerOne
    },
    games: mockEntityAdapterState()
  });
  const { getAllByTestId, getByTestId, unmount } = render(
    <Provider store={spectatorStore}>
      <Board gameId={0} />
    </Provider>
  );

  const tiles = getAllByTestId(/tile-/i);
  const blackRookTile = getByTestId('tile-0-0');

  expect(tiles).toHaveLength(64);
  expect(tiles[0].isSameNode(blackRookTile)).toBeTruthy();
  unmount();
});
