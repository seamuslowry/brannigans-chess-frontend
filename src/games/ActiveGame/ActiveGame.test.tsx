import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { setGameId } from '../../store/activeGame/activeGame';
import { testStore } from '../../utils/testData';
import ActiveGame from './ActiveGame';
import config from '../../config';
import { Move, Piece } from '../../services/ChessService.types';

const mockStore = createMockStore(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.get(`${config.serviceUrl}/pieces/1`, (req, res, ctx) => {
    return res(ctx.json<Piece[]>([]));
  }),
  rest.get(`${config.serviceUrl}/moves/1`, (req, res, ctx) => {
    return res(ctx.json<Move[]>([]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('sets and unsets the game id', async () => {
  const { container, getAllByRole, unmount } = render(
    <Provider store={mockedStore}>
      <MemoryRouter initialEntries={['/test/1']}>
        <Route path="/test/:id">
          <ActiveGame />
        </Route>
      </MemoryRouter>
    </Provider>
  );

  expect(container).toBeInTheDocument();
  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: setGameId.type,
      payload: 1
    })
  );

  await waitForElementToBeRemoved(() => getAllByRole('progressbar')); // wait for service calls to complete

  unmount();
});
