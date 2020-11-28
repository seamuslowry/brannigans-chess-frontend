import React from 'react';
import { render } from '@testing-library/react';
import PlayerStatValue from './PlayerStatValue';

test('renders a number', () => {
  const number = 25;

  const { getByText } = render(<PlayerStatValue>{number}</PlayerStatValue>);

  expect(getByText(number.toString())).toBeInTheDocument();
});

test('renders as a percentage', () => {
  const number = 1 / 3;

  const { getByText } = render(<PlayerStatValue percentage>{number}</PlayerStatValue>);

  expect(getByText('33.33%')).toBeInTheDocument();
});

test('handles NaN', () => {
  const { getByText } = render(<PlayerStatValue>{0 / 0}</PlayerStatValue>);

  expect(getByText('0')).toBeInTheDocument();
});

test('handles positive infinity', () => {
  const { getByText } = render(<PlayerStatValue>{15 / 0}</PlayerStatValue>);

  expect(getByText('0')).toBeInTheDocument();
});

test('handles negative infinity', () => {
  const { getByText } = render(<PlayerStatValue>{-15 / 0}</PlayerStatValue>);

  expect(getByText('0')).toBeInTheDocument();
});
