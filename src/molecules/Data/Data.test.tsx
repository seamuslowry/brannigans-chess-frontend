import React from 'react';
import { render } from '@testing-library/react';
import Data from './Data';
import DataLabel from '../../atoms/DataLabel/DataLabel';
import DataValue from '../../atoms/DataValue/DataValue';

test('renders with label and value', () => {
  const { getByLabelText } = render(
    <Data>
      <DataLabel>label</DataLabel>
      <DataValue>value</DataValue>
    </Data>
  );

  expect(getByLabelText('label')).toHaveTextContent('value');
});
