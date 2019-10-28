import { createElement } from 'react'
import withData from './withData';

export default ({ publicOnly, ...params }, lockId) => (SubComp) => {
  let key = 'data/bureaus'
  if (window.__SHOW_BUREAU_ID !== '00000000') {
    key = `${key}/${window.__SHOW_BUREAU_ID}`
  } else if (lockId) {
    key = `${key}/${lockId}`
  }
  key = `${key}/laws`
  return withData(
    key,
    Object.assign(publicOnly ? { publicOnly } : {}, params),
    publicOnly ? d => ({ ...d, isPublic: true }) : undefined,
  )(props => createElement(SubComp, { ...props, publicOnly, data: props[key] }))
}
