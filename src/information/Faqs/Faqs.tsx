import React from 'react';
import { Box, IconButton } from '@material-ui/core';
import { GitHub } from '@material-ui/icons';
import Faq from './Faq/Faq';

const faqs = [
  {
    question: 'Can I see how this was made?',
    answer: (
      <>
        You can indeed! Check out the github repo
        <IconButton
          component="a"
          target="_blank"
          href="https://github.com/seamuslowry/brannigans-chess"
        >
          <GitHub />
        </IconButton>
      </>
    )
  },
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
        // because the array is static, we can (and should) use the index for the key
        // eslint-disable-next-line react/no-array-index-key
        <Box key={`faq-${index}`} p={1} width="80%">
          <Faq {...q} />
        </Box>
      ))}
    </Box>
  );
};

export default Faqs;
