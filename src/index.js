import React from 'react';
import ReactDOM from 'react-dom';

import WithProvider from './with-provider'
import App from './App';

if (document.getElementById('root')) {
  ReactDOM.render(<WithProvider><App /></WithProvider>, document.getElementById('root'));
}
