import { createElement } from 'react'

import withData from './withData';

export default (SubComp) => {
  let key = 'data/bureaus'

  if (window.__SHOW_BUREAU_ID !== '00000000') {
    key += `/${window.__SHOW_BUREAU_ID}`
    if (window.__SHOW_DEPARTMENT_ID) {
      key += `/${window.__SHOW_DEPARTMENT_ID}`
    }
  }

  return withData(key, { year: new Date().getFullYear() - 1911 })(props => createElement(SubComp, { ...props, data: (props[key]) }))
}
