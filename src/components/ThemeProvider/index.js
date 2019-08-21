import React, { Fragment } from 'react';
import { ThemeProvider } from 'styled-components';
import 'sanitize.css';
import { SizeMe } from 'react-sizeme'

import FontSizeContext from './FontSizeContext'
import GlobalStyles from './global-styles';

import theme from './theme';
import Box from '../Box';

export default (props) => (
  <ThemeProvider theme={theme}>
    <Fragment>
      <SizeMe>
        {({ size: { width } }) => {
          const fontSize = Math.round(width / 94)
          return (
            <FontSizeContext.Provider value={{ em: fontSize }}>
              <Box fontSize={fontSize} {...props} />
            </FontSizeContext.Provider>
          )
        }}
      </SizeMe>
      <GlobalStyles />
    </Fragment>
  </ThemeProvider>
);
