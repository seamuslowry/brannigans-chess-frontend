import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { AppState } from '@auth0/auth0-react/dist/auth0-provider';
import { Game } from '../../../services/ChessService.types';
import config from '../../../config';
import { emptyGame, testStore } from '../../../utils/testData';
import ResignGameButton from './ResignGameButton';
import { resignGame } from '../../../store/games/games';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.post(`${config.serviceUrl}/players/resign/1`, (req, res, ctx) => {
    return res(ctx.json<Game>(emptyGame));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('resigns a game', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <ResignGameButton gameId={1} />
    </Provider>
  );

  const button = getByTestId('resign-game-button');
  fireEvent.click(button);

  await waitFor(() => expect(getByTestId('leave-game-button')).toBeDisabled());
  await waitFor(() => expect(getByTestId('leave-game-button')).not.toBeDisabled());

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: resignGame.pending.type
    })
  );
});
