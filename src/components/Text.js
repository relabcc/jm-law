import React from 'react';
import styled from 'styled-components';
import range from 'lodash/range';
import {
  typography,
  space,
  color,
  display,
  position,
} from 'styled-system';
import tag from 'clean-tag';

import blacklist from './utils/blacklist';
import injectProps from './utils/injectProps';

const Text = styled(tag)`
  margin-top: 0;
  margin-bottom: 0;
  ${typography}
  ${display}
  ${space}
  ${color}
  ${position}
  ${injectProps('textTransform')}
`;

Text.defaultProps = {
  is: 'p',
  fontSize: '1em',
  // lineHeight: 1.5,
  blacklist,
};

Text.inline = (props) => <Text is="span" {...props} />;
Text.bold = (props) => <Text fontWeight="bold" {...props} />;
Text.thin = (props) => <Text fontWeight="200" {...props} />;

range(1, 7).forEach((key) => {
  const h = `h${key}`;
  Text[h] = (props) => (
    <Text
      is={h}
      fontSize={`${1 + ((6 - key) * 0.125)}em`}
      {...props}
    />
  );
});

Text.displayName = 'Text';

export default Text;
