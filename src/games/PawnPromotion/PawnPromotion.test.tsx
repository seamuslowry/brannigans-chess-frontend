import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { makePiece, mockEntityAdapterState, testStore } from '../../utils/testData';
import config from '../../config';
import PawnPromotion from './PawnPromotion';
import { promotePawn } from '../../store/pieces/pieces';
import { Piece } from '../../services/ChessService.types';

const mockStore = createMockStore(getDefaultMiddleware());
const mockedStore = mockStore(testStore);

const blackPawn = makePiece('PAWN', 'BLACK', 7, 0);
const blackPawnPromoteStore = mockStore({
  ...testStore,
  pieces: mockEntityAdapterState(blackPawn)
});

const whitePawn = makePiece('PAWN', 'WHITE');
const whitePawnPromoteStore = mockStore({
  ...testStore,
  pieces: mockEntityAdapterState(whitePawn)
});

const server = setupServer(
  rest.post(`${config.serviceUrl}/pieces/promote/${blackPawn.id}/QUEEN`, (req, res, ctx) => {
    return res(ctx.json<Piece>(makePiece('QUEEN', 'BLACK')));
  }),
  rest.post(`${config.serviceUrl}/pieces/promote/${whitePawn.id}/QUEEN`, (req, res, ctx) => {
    return res(ctx.json<Piece>(makePiece('QUEEN', 'WHITE')));
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
  const { getByAltText } = render(
    <Provider store={blackPawnPromoteStore}>
      <PawnPromotion gameId={0} color="BLACK" />
    </Provider>
  );

  await waitFor(() => getByAltText('BLACK-QUEEN'));
});

test('promotes a pawn - BLACK', async () => {
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
        type: promotePawn.fulfilled.type
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
  const { getByAltText } = render(
    <Provider store={whitePawnPromoteStore}>
      <PawnPromotion gameId={0} color="WHITE" />
    </Provider>
  );

  await waitFor(() => getByAltText('WHITE-QUEEN'));
});

test('promotes a pawn - WHITE', async () => {
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
        type: promotePawn.fulfilled.type
      })
    )
  );
});
