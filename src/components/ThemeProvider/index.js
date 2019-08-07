import React, { Fragment } from 'react';
import { ThemeProvider } from 'styled-components';
import 'sanitize.css';

import GlobalStyles from './global-styles';

import theme from './theme';
import Box from '../Box';

export default (props) => (
  <ThemeProvider theme={theme}>
    <Fragment>
      <Box fontSize={[14, null, 16]} {...props} />
      <GlobalStyles />
    </Fragment>
  </ThemeProvider>
);
