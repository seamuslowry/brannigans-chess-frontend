import React from 'react';
import { Box } from '@material-ui/core';
import Faq from '../../molecules/Faq/Faq';

const faqs = [
  {
    question: 'Why can I only see half the pieces?',
    answer:
      "As the inspirational quote states: \" you can never let your adversary see your pieces\". You can't see your adversary's pieces and they can't see yours."
  },
  {
    question: 'Are there plans to allow a draw?',
    answer: 'Coward.'
  },
  {
    question: 'What about a draw by repitition?',
    answer:
      "No draw by repetition either. When you can't see the other pieces, it makes a draw by repetition annoying rather than tactical."
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
