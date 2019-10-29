import React, { Component } from 'react'
import { Provider } from 'react-redux';
import { calculateResponsiveState } from 'redux-responsive'

import ThemeProvider from './components/ThemeProvider';
import creatStore from './stores/createStore';

const store = creatStore();

// window.__DEPARTMENT_ID = '1631100000000'
// window.__BUREAU_ID = '13'
window.__BUREAU_ID = window.__BUREAU_ID || '00000000'
window.__SHOW_BUREAU_ID = '00000000'
if (window.location.search) {
  const res = /showBureau=([^&]+)/g.exec(window.location.search)
  if (res && res[1]) {
    const id = decodeURIComponent(res[1])
    window.__SHOW_BUREAU_ID = id
    window.__BUREAU_ID = id
  }
}

class InitialDispatch extends Component {
  componentDidMount() {
    if (typeof window !== 'undefined') {
      store.dispatch(calculateResponsiveState(window))
    }
  }

  render() {
    return this.props.children
  }
}

export default ({ children }) => (
  <Provider store={store}>
    <InitialDispatch>
      <ThemeProvider>{children}</ThemeProvider>
    </InitialDispatch>
  </Provider>
)
