import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';
import { ActionCreator, AnyAction, getDefaultMiddleware } from '@reduxjs/toolkit';
import createMockStore from 'redux-mock-store';
import { AppState } from '../../store/store';
import { playerOne, testStore } from '../../utils/testData';
import DisplayName from './DisplayName';
import { updateDisplayName } from '../../store/auth/auth';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Player } from '../../services/ChessService.types';
import config from '../../config';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

const server = setupServer(
  rest.post(`${config.serviceUrl}/players/name`, (req, res, ctx) => {
    return res(ctx.json<Player>(playerOne));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('changes the player name', async () => {
  const newName = 'new Name';
  const { getByRole, getByLabelText, getByDisplayValue } = render(
    <Provider store={mockedStore}>
      <DisplayName player={playerOne} />
    </Provider>
  );

  const editButton = getByLabelText('edit');
  fireEvent.click(editButton);

  const input = getByDisplayValue(playerOne.name);
  fireEvent.change(input, { target: { value: newName } });

  const submitButton = getByLabelText('confirm');
  fireEvent.click(submitButton);

  await waitForElementToBeRemoved(() => getByRole('progressbar'));

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: updateDisplayName.fulfilled.type
    })
  );
});

test('cancels changes the player name', async () => {
  const newName = 'new Name';
  const { getByLabelText, getByDisplayValue } = render(
    <Provider store={mockedStore}>
      <DisplayName player={playerOne} />
    </Provider>
  );

  const editButton = getByLabelText('edit');
  fireEvent.click(editButton);

  const input = getByDisplayValue(playerOne.name);
  fireEvent.change(input, { target: { value: newName } });

  const submitButton = getByLabelText('cancel');
  fireEvent.click(submitButton);

  expect(getByDisplayValue(playerOne.name)).toBeInTheDocument();
  expect(mockedStore.getActions()).not.toContainEqual(
    expect.objectContaining({
      type: updateDisplayName.pending.type
    })
  );
});
