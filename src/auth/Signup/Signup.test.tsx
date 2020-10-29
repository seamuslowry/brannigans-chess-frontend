import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { ActionCreator, AnyAction } from 'redux';
import createMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AppState } from '../../store/store';
import { testStore } from '../../utils/testData';
import Signup from './Signup';

const mockStore = createMockStore<AppState, ActionCreator<AnyAction>>([thunk]);
const mockedStore = mockStore(testStore);

beforeEach(() => mockedStore.clearActions());

test('renders a signup button', async () => {
  const { getByText } = render(
    <Provider store={mockedStore}>
      <Signup />
    </Provider>
  );

  expect(getByText('Signup')).toBeInTheDocument();
});
