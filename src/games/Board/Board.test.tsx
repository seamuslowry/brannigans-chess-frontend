import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { testStore } from '../../utils/testData';
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
