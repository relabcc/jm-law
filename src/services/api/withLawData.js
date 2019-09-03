import { createElement } from 'react'
import withData from './withData';

export default (params, lockId) => (SubComp) => {
  let key = 'data/bureaus'
  if (typeof window !== 'undefined' && window.__ID !== '00000000') {
    key = `${key}/${window.__ID}`
  }
  if (lockId) {
    key = `${key}/${lockId}`
  }
  key = `${key}/laws`
  return withData(key, params)(props => createElement(SubComp, { ...props, data: props[key] }))
}
