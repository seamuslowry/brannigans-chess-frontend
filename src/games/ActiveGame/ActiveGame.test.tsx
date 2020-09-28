import React from 'react';
import { render } from '@testing-library/react';
import ActiveGame from './ActiveGame';
import createMockStore from 'redux-mock-store';
import { testStore } from '../../utils/testData';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';

const mockStore = createMockStore();
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('renders without crashing', async () => {
  const { container } = render(
    <Provider store={mockedStore}>
      <MemoryRouter>
        <Route path="/test/:id">
          <ActiveGame />
        </Route>
      </MemoryRouter>
    </Provider>
  );

  expect(container).toBeInTheDocument();
});
