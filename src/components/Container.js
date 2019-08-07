import React from 'react';

import Box from './Box';

const Container = (props) => <Box {...props} />;

Container.defaultProps = {
  mx: 'auto',
  px: ['1em', null, '2em'],
  width: 1,
};

Container.displayName = 'Container';

export default Container;
