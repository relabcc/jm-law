import React, { PureComponent } from 'react';
import Measure from 'react-measure'

import FontSizeContext from './ThemeProvider/FontSizeContext'
import Box from './Box'

class Toggler extends PureComponent {
  state = {
    poses: this.props.options.map(() => ({}))
  }

  poses = []

  handleBound = (i, bounds) => {
    this.poses[i] = bounds
    if (this.poses.every(Boolean) && this.poses.length === this.props.options.length) {
      this.setState({ poses: this.poses })
    }
  }

  render() {
    const { options, activeIndex, onToggle, color, bg } = this.props
    const { poses } = this.state;
    return (
      <FontSizeContext.Consumer>
      {({ em }) => (
        <Box borderRadius="1.5em" bg={bg} px="0.5em">
          <Box position="relative">
            <Box
              position="absolute"
              left={poses[activeIndex].left - poses[0].left - em * 0.65}
              top="50%"
              bottom="0"
              width={poses[activeIndex].width + 1.3 * em}
              transition="all 0.25s"
            >
              <Box py="1.25em" bg={color} transform="translateY(-50%)" borderRadius="1.25em" />
            </Box>
            <Box position="relative">
              {options.map((label, i) => (
                <Measure bounds onResize={({ bounds }) => this.handleBound(i, bounds)} key={i}>
                  {({ measureRef }) => (
                    <Box.inline ref={measureRef} px="1.25em" py="0.5em" color="white" onClick={() => onToggle(i)}>
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
  }
}


Toggler.defaultProps = {
  color: 'primary',
  bg: 'rgba(255,255,255,0.2)',
  onToggle: () => {},
}

export default Toggler;
