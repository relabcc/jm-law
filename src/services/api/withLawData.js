import { createElement } from 'react'
import withData from './withData';

export default ({ publicOnly, ...params }, lockId) => (SubComp) => {
  let key = 'data/bureaus'
  if (typeof window !== 'undefined' && window.__BUREAU_ID !== '00000000') {
    key = `${key}/${window.__BUREAU_ID}`
  }
  if (lockId) {
    key = `${key}/${lockId}`
  }
  key = `${key}/laws`
  return withData(key, Object.assign(publicOnly ? { publicOnly } : {}, params))(props => createElement(SubComp, { ...props, data: props[key] }))
}
