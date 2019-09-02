import React, { forwardRef } from 'react';
import styled from 'styled-components';
import tag from 'clean-tag';
import {
  space,
  layout,
  typography,
  position,
  color,
  borderRadius,
  zIndex,
  border,
  flex,
  opacity,
  style,
  backgroundImage,
  variant,
} from 'styled-system';

import blacklist from './utils/blacklist';
import injectProps from './utils/injectProps';

const Box = styled(tag)`
  ${space}
  ${layout}
  ${position}
  ${typography}
  ${color}
  ${position}
  ${zIndex}
  ${border}
  ${flex}
  ${borderRadius}
  ${opacity}
  ${backgroundImage}
  ${variant({ scale: 'gradients', prop: 'gradient' })}
  ${injectProps('whiteSpace')}
  ${injectProps('overflow')}
  ${injectProps('transform')}
  ${injectProps('transition')}
  ${style({
    prop: 'zOrder',
    cssProperty: 'zIndex',
    key: 'zOrder',
  })}
  ${({ onClick }) => onClick && 'cursor: pointer;'}
`;

Box.defaultProps = {
  blacklist,
};

Box.displayName = 'Box';

Box.inline = forwardRef((props, ref) => <Box is="span" ref={ref} display="inline-block" verticalAlign="middle" {...props} />);

export default Box;
