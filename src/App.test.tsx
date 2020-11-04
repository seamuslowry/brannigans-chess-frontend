import React from 'react';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import App from './App';
import { Game } from './services/ChessService.types';
import { AppState } from './store/store';
import { testStore } from './utils/testData';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.get('/games', (req, res, ctx) => {
    return res(ctx.json<Game[]>([]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders the insirational quote', () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <App />
    </Provider>
  );
  const quote = getByText(/never let your adversary see your pieces/i);
  expect(quote).toBeInTheDocument();
});
