import React, { Fragment } from 'react';
import { ThemeProvider } from 'styled-components';
import 'sanitize.css';
import { SizeMe } from 'react-sizeme'

import FontSizeContext from './FontSizeContext'
import GlobalStyles from './global-styles';

import theme from './theme';

export default ({ children }) => (
  <ThemeProvider theme={theme}>
    <SizeMe>
      {({ size: { width } }) => {
        const fontSize = Math.round(Math.max(width, 800) / 94)
        return (
          <div>
            <FontSizeContext.Provider value={{ em: fontSize }}>
              <Fragment>
                <GlobalStyles fontSize={fontSize} />
                {children}
              </Fragment>
            </FontSizeContext.Provider>
          </div>
        )
      }}
    </SizeMe>
  </ThemeProvider>
);
