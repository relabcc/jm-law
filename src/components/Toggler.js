import React, { useState } from 'react';
import Measure from 'react-measure'

import FontSizeContext from './ThemeProvider/FontSizeContext'
import Box from './Box'

const Toggler = ({ options, activeIndex, onToggle }) => {
  const poses = options.map(() => useState({}))
  return (
    <FontSizeContext.Consumer>
      {({ em }) => (
        <Box borderRadius="1.5em" bg="rgba(255,255,255,0.2)" px="0.5em">
          <Box position="relative">
            <Box
              position="absolute"
              left={poses[activeIndex][0].left - poses[0][0].left - em * 0.5}
              top="50%"
              bottom="0"
              width={poses[activeIndex][0].width + em}
              transition="all 0.25s"
            >
              <Box py="1.5em" bg="primary" transform="translateY(-50%)" borderRadius="1.5em" />
            </Box>
            <Box position="relative">
              {options.map((label, i) => (
                <Measure bounds onResize={({ bounds }) => poses[i][1](bounds)}>
                  {({ measureRef }) => (
                    <Box.inline key={i} ref={measureRef} px="1.25em" py="0.75em" color="white" onClick={() => onToggle(i)}>
                      {label}
                    </Box.inline>
                  )}
                </Measure>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </FontSizeContext.Consumer>
  );
};

Toggler.defaultProps = {
  activeIndex: 1,
  onToggle: () => {},
}

export default Toggler;
