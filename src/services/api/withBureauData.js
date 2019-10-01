import { createElement } from 'react'
import mapValues from 'lodash/mapValues'

import withData from './withData';

const keys = [
  'canceled',
  'canceledDollar',
  'issued',
  'issuedDollar',
  'received',
  'receivedDollar',
]

const transformData = data => mapValues(data, d => ({
  ...d,
  monthData: d.monthData.map(m => ({
    ...m,
    data: m.types.reduce((sum, t) => {
      keys.forEach((key) => {
        sum[key] = sum[key] || 0
        sum[key] += t.data[key]
      }, {})
      return sum
    }, {})
  })),
}))

export default (SubComp) => {
  let key = 'data/bureaus'

  if (typeof window !== 'undefined' && window.__BUREAU_ID !== '00000000') {
    key = `${key}/${window.__BUREAU_ID}`
  }
  return withData(key, { year: new Date().getFullYear() - 1911 })(props => createElement(SubComp, { ...props, data: transformData(props[key]) }))
}
