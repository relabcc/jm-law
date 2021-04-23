import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react';
import ReactDOM from 'react-dom';

import WithProvider from './with-provider'

if (document.getElementById('root')) {
  const App = require('./App').default;
  ReactDOM.render(<WithProvider><App /></WithProvider>, document.getElementById('root'));
}
