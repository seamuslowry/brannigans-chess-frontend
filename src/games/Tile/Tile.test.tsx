import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Tile from './Tile';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { testStore } from '../../utils/testData';
import { SELECT_TILE } from '../../store/activeGame/activeGame';

const mockStore = createMockStore();
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('selects on click', async () => {
  const { getByTestId } = render(
    <Provider store={mockedStore}>
      <Tile row={0} col={0} />
    </Provider>
  );

  const tile = getByTestId('tile-0-0');
  fireEvent.click(tile);

  expect(mockedStore.getActions()).toContainEqual(
    expect.objectContaining({
      type: SELECT_TILE
    })
  );
});
