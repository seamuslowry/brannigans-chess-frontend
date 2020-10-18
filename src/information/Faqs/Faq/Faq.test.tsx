import React from 'react';
import { render } from '@testing-library/react';
import Faq from './Faq';

test('renders the question and the answer', () => {
  const question = 'question';
  const answer = 'answer';
  const { getByText } = render(<Faq question={question} answer={answer} />);

  expect(getByText(question)).toBeInTheDocument();
  expect(getByText(answer)).toBeInTheDocument();
});
