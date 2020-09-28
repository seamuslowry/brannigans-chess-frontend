import React from 'react';
import { render } from '@testing-library/react';
import ActiveGame from './ActiveGame';
import createMockStore from 'redux-mock-store';
import { testStore } from '../../utils/testData';
import { Provider } from 'react-redux';

const mockStore = createMockStore();
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('renders without crashing', async () => {
  const { container } = render(
    <Provider store={mockedStore}>
      <ActiveGame />
    </Provider>
  );

  expect(container).toBeInTheDocument();
});
