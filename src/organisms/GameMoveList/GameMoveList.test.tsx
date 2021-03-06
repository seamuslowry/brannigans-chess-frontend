import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { mockEntityAdapterState, testStore, whiteMove } from '../../utils/testData';
import { Move } from '../../services/ChessService.types';
import config from '../../config';
import GameMoveList from './GameMoveList';
import { getMoves } from '../../store/moves/moves';

const mockStore = createMockStore(getDefaultMiddleware());
const mockedStore = mockStore({
  ...testStore,
  moves: mockEntityAdapterState(whiteMove)
});

const server = setupServer(
  rest.get(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
    return res(
      ctx.json<Move[]>([whiteMove])
    );
  })
);

beforeEach(() => mockedStore.clearActions());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('gets player moves on mount', async () => {
  const { getByRole } = render(
    <Provider store={mockedStore}>
      <GameMoveList gameId={0} />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for service call to complete

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: getMoves.fulfilled.type
    })
  );
});

test('handles an error getting moves on mount', async () => {
  server.use(
    rest.get(`${config.serviceUrl}/moves/0`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const { getByRole } = render(
    <Provider store={mockedStore}>
      <GameMoveList gameId={0} />
    </Provider>
  );

  await waitForElementToBeRemoved(() => getByRole('progressbar')); // wait for service call to complete

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: getMoves.rejected.type
    })
  );
});
