import React, { PureComponent } from 'react';
import Measure from 'react-measure'
import debounce from 'lodash/debounce'

import Box from '../Box'

class ChartBase extends PureComponent {
  constructor(props) {
    super(props)
    this.handleResize = debounce(this.handleResize, 200)
  }

  state = {
    dimensions: {},
  }

  handleResize = ({ bounds }) => this.setState({ dimensions: bounds })

  render() {
    const { children, ratio, ...props } = this.props;
    const { width, height } = this.state.dimensions;
    return (
      <Measure onResize={this.handleResize} bounds>
        {({ measureRef }) => (
          <Box position="relative" pt={`${ratio * 100}%`} {...props} ref={measureRef}>
            {width && height && (
              <Box
                is="svg"
                position="absolute"
                top="0"
                left="0"
                width={width}
                height={height}
              >
                {children({ width, height })}
              </Box>
            )}
          </Box>
        )}
      </Measure>
    );
  }
}

ChartBase.defaultProps = {
  ratio: 1 / 3,
}

export default ChartBase;
