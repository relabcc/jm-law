import React from 'react';

import Box from '../Box'
import dot from './dot.svg'

const PatternBg = ({ children, ...props }) => (
  <Box
    {...props}
    backgroundImage={`url('${dot}')`}
  >
    {children}
  </Box>
)

PatternBg.defaultProps = {
  backgroundSize: '10px',
  backgroundRepeat: 'repeat repeat',
  backgroundPosition: 'center',
}

export default PatternBg;
