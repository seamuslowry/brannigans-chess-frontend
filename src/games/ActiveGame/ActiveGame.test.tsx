import React from 'react';
import { render } from '@testing-library/react';
import ActiveGame from './ActiveGame';
import createMockStore from 'redux-mock-store';
import { testStore } from '../../utils/testData';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { CLEAR_GAME, SET_GAME_ID } from '../../store/activeGame/activeGame';
import thunk from 'redux-thunk';
import config from '../../config';
import { Piece } from '../../services/ChessService';

const mockStore = createMockStore([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.get(`${config.serviceUrl}/pieces/0`, (req, res, ctx) => {
    return res(ctx.json<Piece[]>([]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('sets and unsets the game id', async () => {
  const { container, unmount } = render(
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
      type: SET_GAME_ID,
      payload: 1
    })
  );

  unmount();

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: CLEAR_GAME
    })
  );
});