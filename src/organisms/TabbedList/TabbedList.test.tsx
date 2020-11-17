import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import TabbedList from './TabbedList';

const options = [
  { label: 'one', value: 1 },
  { label: 'two', value: 2 },
  { label: 'three', value: 3 },
  { label: 'four', value: 4 }
];

test('renders all tabs', async () => {
  const { getByText } = render(
    <TabbedList
      tabOptions={options}
      tabValue={1}
      onTabChange={jest.fn()}
      page={0}
      totalPages={0}
      onPageChange={jest.fn()}
    />
  );

  // all tabs must be in the document
  options.forEach(o => getByText(o.label));
});

test('switches a tab', async () => {
  const onTabChange = jest.fn();
  const { getByText } = render(
    <TabbedList
      tabOptions={options}
      tabValue={1}
      onTabChange={onTabChange}
      page={0}
      totalPages={0}
      onPageChange={jest.fn()}
    />
  );

  const tabThree = getByText('three');
  fireEvent.click(tabThree);

  expect(onTabChange).toHaveBeenCalledWith(3);
});

test('switches a page', async () => {
  const onPageChange = jest.fn();
  const { getByText } = render(
    <TabbedList
      tabOptions={[]}
      tabValue={1}
      onTabChange={jest.fn()}
      page={1}
      totalPages={10}
      onPageChange={onPageChange}
    />
  );

  const pageFive = getByText('5');
  fireEvent.click(pageFive);

  expect(onPageChange).toHaveBeenCalledWith(5);
});
