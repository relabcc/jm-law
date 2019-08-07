import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withContentRect } from 'react-measure';
import isFunction from 'lodash/isFunction'

import Box from './Box';

class VerticalCenter extends PureComponent {
  static getDerivedStateFromProps({ contentRect }, { containerRef }) {
    if (containerRef) {
      const shouldCenter = containerRef.getBoundingClientRect().height - contentRect.bounds.height > 5;
      return {
        shouldCenter
      }
    }
    return {}
  }

  state = {}

  componentDidMount() {
    this.props.measure()
  }

  componentDidUpdate(prevProps, prevState) {
    const { shouldCenter } = this.state
    if (shouldCenter !== prevState.shouldCenter) {
      this.props.onAlignChange(shouldCenter)
    }
  }

  handleContainerRef = (containerRef) => {
    this.setState({ containerRef })
  }

  render() {
    const {
      children,
      onAlignChange,
      measure,
      measureRef,
      contentRect,
      ...props
    } = this.props;
    const { shouldCenter } = this.state;
    return (
      <Box
        position="relative"
        height="100%"
        ref={this.handleContainerRef}
        {...props}
      >
        <Box
          position={shouldCenter && 'absolute'}
          top={shouldCenter ? '50%' : 0}
          width={1}
          transform={shouldCenter && 'translateY(-50%)'}
          ref={measureRef}
        >
          {isFunction(children) ? children(shouldCenter) : children}
        </Box>
      </Box>
    );
  }
}

VerticalCenter.displayName = 'VerticalCenter';

VerticalCenter.propTypes = {
  onAlignChange: PropTypes.func,
}

VerticalCenter.defaultProps = {
  onAlignChange: () => {}
}

export default withContentRect('bounds')(VerticalCenter);
