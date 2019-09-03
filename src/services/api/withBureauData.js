import { createElement } from 'react'
import withData from './withData';

export default (SubComp) => {
  let key = 'data/bureaus'
  if (typeof window !== 'undefined' && window.__ID !== '00000000') {
    key = `${key}/${window.__ID}`
  }
  return withData(key)(props => createElement(SubComp, { ...props, data: props[key] }))
}
