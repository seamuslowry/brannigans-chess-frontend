import React from 'react';
import { Card, CardContent, CardHeader } from '@material-ui/core';

interface Props {
  question: React.ReactNode;
  answer: React.ReactNode;
}

const Faq: React.FC<Props> = ({ question, answer }) => {
  return (
    <Card>
      <CardHeader title={question} />
      <CardContent>{answer}</CardContent>
    </Card>
  );
};

export default Faq;
