import { createGlobalStyle } from 'styled-components';

import theme from './theme';

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Comfortaa:400,700&display=swap');
  body {
    font-family: ${theme.font};
    min-width: 100%;
    min-height: 100%;
    color: ${theme.colors.text};
  }
`;
