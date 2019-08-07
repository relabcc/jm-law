import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withContentRect } from 'react-measure'
import isIE from './utils/isIE'

import Box from './Box';

const parseViewbox = (vb) => {
  try {
    const [x1, y1, x2, y2] = vb.split(' ');
    return (y2 - y1) / (x2 - x1);
  } catch {
    return 1;
  }
};

class SVG extends PureComponent {
  constructor(props) {
    super(props)
    this.ratio = parseViewbox(props.viewBox)
  }

  componentDidMount() {
    this.props.measure();
  }

  render() {
    const {
      viewBox,
      children,
      measure,
      measureRef,
      contentRect: { bounds: { width } },
      ...props
    } = this.props;
    return isIE ? (
      <Box is="span" ref={measureRef} {...props}>
        <Box
          is="svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={viewBox}
          width={width}
          height={this.ratio * width}
          verticalAlign="auto"
        >
          {children}
        </Box>
      </Box>
    ) : (
      <Box
        is="svg"
        ref={measureRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        {...props}
      >
        {children}
      </Box>
    );
  }
}

SVG.propTypes = {
  viewBox: PropTypes.string,
  children: PropTypes.node.isRequired,
};

SVG.defaultProps = {
  display: 'inline-block',
}

SVG.displayName = 'SVG';

export default withContentRect('bounds')(SVG);
