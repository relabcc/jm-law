import React from 'react';

import Box from '../Box'
import line from './line.svg'

const PatternBg = ({ children, ...props }) => (
  <Box
    {...props}
    backgroundImage={`url('${line}')`}
  >
    {children}
  </Box>
)

PatternBg.defaultProps = {
  backgroundSize: '20px',
  backgroundRepeat: 'repeat no-repeat',
  backgroundPosition: 'center',
}

export default PatternBg;
