import React from 'react';
import { render } from '@testing-library/react';
import Board from './Board';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { testStore } from '../../utils/testData';

const mockStore = createMockStore();
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('renders 64 tiles', async () => {
  const { getAllByTestId } = render(
    <Provider store={mockedStore}>
      <Board />
    </Provider>
  );

  const tiles = getAllByTestId(/tile-/i);

  expect(tiles).toHaveLength(64);
});
