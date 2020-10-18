import React from 'react';
import { Box } from '@material-ui/core';
import Faq from './Faq/Faq';

const faqs = [
  {
    question: 'Why can I only see half the pieces?',
    answer:
      "As the inspirational quote states: \" you can never let your adversary see your pieces\". You can't see your adversary's pieces and they can't see yours."
  },
  {
    question: 'Why is there no option to offer a draw?',
    answer: 'Coward.'
  }
];

const Faqs: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="100%">
      {faqs.map((q, index) => (
        <Box key={`faq-${index}`} p={1} width="80%">
          <Faq {...q} />
        </Box>
      ))}
    </Box>
  );
};

export default Faqs;
