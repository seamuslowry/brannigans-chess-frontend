import React from 'react';
import { render } from '@testing-library/react';
import Board from './Board';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { testStore } from '../../utils/testData';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Piece } from '../../services/ChessService';
import config from '../../config';
import thunk from 'redux-thunk';

const mockStore = createMockStore([thunk]);
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
