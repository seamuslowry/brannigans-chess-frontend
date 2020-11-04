import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ActionCreator, AnyAction } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createMockStore from 'redux-mock-store';
import Tile from './Tile';
import { testStore } from '../../utils/testData';
import { clickTile } from '../../store/activeGame/activeGame.thunk';
import { AppState } from '../../store/store';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('clicks a tile', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile row={0} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-0-0');
  fireEvent.click(tile);

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: clickTile.pending.type
    })
  );
});
