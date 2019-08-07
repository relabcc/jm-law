import React, { useState } from 'react';
import Measure from 'react-measure'
import debounce from 'lodash/debounce'

import Box from '../Box'

const AutoScale = ({ children, ...props }) => {
  const [dimensions, setDimensions] = useState({})
  const { width, height } = dimensions;
  const handleResize = ({ bounds }) => setDimensions(bounds)
  // console.log('AutoScale')
  return (
    <Measure onResize={debounce(handleResize, 200)} bounds>
      {({ measureRef }) => (
        <Box position="relative" {...props} ref={measureRef}>
          {width && height && children({ width, height })}
        </Box>
      )}
    </Measure>
  );
};

AutoScale.defaultProps = {
  pt: '33%',
}

export default AutoScale;
