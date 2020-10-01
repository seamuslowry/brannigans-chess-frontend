import React from 'react';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';
import { Game } from './services/ChessService';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppState } from './store/store';
import { testStore } from './utils/testData';
import { Provider } from 'react-redux';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
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
