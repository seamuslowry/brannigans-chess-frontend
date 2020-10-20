import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import thunk from 'redux-thunk';
import { testStore, whiteMove } from '../../utils/testData';
import { Move } from '../../services/ChessService.types';
import config from '../../config';
import PawnPromotion from './PawnPromotion';
import { SET_TILE } from '../../store/activeGame/activeGame';
import { immutableUpdate } from '../../utils/arrayHelpers';
import { SEND_ALERT } from '../../store/notifications/notifications';

const mockStore = createMockStore([thunk]);
const mockedStore = mockStore({
  ...testStore,
  activeGame: {
    ...testStore.activeGame
  }
});

const server = setupServer(
  rest.post(`${config.serviceUrl}/pieces/promote/QUEEN`, (req, res, ctx) => {
    return res(
      ctx.json<Move[]>([whiteMove])
    );
  })
);

beforeEach(() => mockedStore.clearActions());
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('does not open when there is no pawn on the final row - BLACK', async () => {
  const { queryAllByAltText } = render(
    <Provider store={mockedStore}>
      <PawnPromotion gameId={0} color="BLACK" />
    </Provider>
  );

  expect(queryAllByAltText('BLACK-QUEEN')).toHaveLength(0);
});

test('opens when there is a pawn on the final row - BLACK', async () => {
  const blackPawnPromoteStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 7, 0, { type: 'PAWN', color: 'BLACK' })
    }
  });

  const { getByAltText } = render(
    <Provider store={blackPawnPromoteStore}>
      <PawnPromotion gameId={0} color="BLACK" />
    </Provider>
  );

  await waitFor(() => getByAltText('BLACK-QUEEN'));
});

test('promotes a pawn - BLACK', async () => {
  const blackPawnPromoteStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 7, 0, { type: 'PAWN', color: 'BLACK' })
    }
  });

  const { getByAltText } = render(
    <Provider store={blackPawnPromoteStore}>
      <PawnPromotion gameId={0} color="BLACK" />
    </Provider>
  );

  const node = await waitFor(() => getByAltText('BLACK-QUEEN'));
  fireEvent.click(node);

  await waitFor(() =>
    expect(blackPawnPromoteStore.getActions()).toContainEqual(
      expect.objectContaining({
        type: SET_TILE
      })
    )
  );
});

test('handles an error when promoting a pawn - BLACK', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/pieces/promote/QUEEN`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const blackPawnPromoteStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 7, 0, { type: 'PAWN', color: 'BLACK' })
    }
  });

  const { getByAltText } = render(
    <Provider store={blackPawnPromoteStore}>
      <PawnPromotion gameId={0} color="BLACK" />
    </Provider>
  );

  const node = await waitFor(() => getByAltText('BLACK-QUEEN'));
  fireEvent.click(node);

  await waitFor(() =>
    expect(blackPawnPromoteStore.getActions()).toContainEqual(
      expect.objectContaining({
        type: SEND_ALERT
      })
    )
  );
});

test('does not open when there is no pawn on the final row - BLACK', async () => {
  const { queryAllByAltText } = render(
    <Provider store={mockedStore}>
      <PawnPromotion gameId={0} color="BLACK" />
    </Provider>
  );

  expect(queryAllByAltText('BLACK-QUEEN')).toHaveLength(0);
});

test('opens when there is a pawn on the final row - WHITE', async () => {
  const whitePawnPromoteStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, { type: 'PAWN', color: 'WHITE' })
    }
  });

  const { getByAltText } = render(
    <Provider store={whitePawnPromoteStore}>
      <PawnPromotion gameId={0} color="WHITE" />
    </Provider>
  );

  await waitFor(() => getByAltText('WHITE-QUEEN'));
});

test('promotes a pawn - WHITE', async () => {
  const whitePawnPromoteStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, { type: 'PAWN', color: 'WHITE' })
    }
  });

  const { getByAltText } = render(
    <Provider store={whitePawnPromoteStore}>
      <PawnPromotion gameId={0} color="WHITE" />
    </Provider>
  );

  const node = await waitFor(() => getByAltText('WHITE-QUEEN'));
  fireEvent.click(node);

  await waitFor(() =>
    expect(whitePawnPromoteStore.getActions()).toContainEqual(
      expect.objectContaining({
        type: SET_TILE
      })
    )
  );
});

test('handles an error when promoting a pawn - WHITE', async () => {
  server.use(
    rest.post(`${config.serviceUrl}/pieces/promote/QUEEN`, (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  const whitePawnPromoteStore = mockStore({
    ...testStore,
    activeGame: {
      ...testStore.activeGame,
      tiles: immutableUpdate(testStore.activeGame.tiles, 0, 0, { type: 'PAWN', color: 'WHITE' })
    }
  });

  const { getByAltText } = render(
    <Provider store={whitePawnPromoteStore}>
      <PawnPromotion gameId={0} color="WHITE" />
    </Provider>
  );

  const node = await waitFor(() => getByAltText('WHITE-QUEEN'));
  fireEvent.click(node);

  await waitFor(() =>
    expect(whitePawnPromoteStore.getActions()).toContainEqual(
      expect.objectContaining({
        type: SEND_ALERT
      })
    )
  );
});
