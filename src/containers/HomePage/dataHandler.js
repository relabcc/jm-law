import map from 'lodash/map'
import reduce from 'lodash/reduce'
import last from 'lodash/last'
import get from 'lodash/get'

const keys = [
  'canceled',
  'canceledDollar',
  'issued',
  'issuedDollar',
  'received',
  'receivedDollar',
  'executed',
]

export const getBureauTotal = (data, activeType) => data.map(({ label, id, monthData, hasChildren }) => ({
  label,
  id,
  hasChildren,
  ...keys.reduce((allData, key) => {
    allData[key] = monthData.reduce((all, d) => all + (activeType ? d.types[activeType].data[key] : d.data[key]), 0)
    allData.executed = get(last(monthData), (activeType ? ['types', activeType] : []).concat('data', 'executed'))
    return allData
  }, {})
})).map((d) => ({
  ...d,
  receiveRate: d.receivedDollar / d.issuedDollar,
  executedRate: d.executed / d.issued,
}))

export const getTypes = (data, lockId) => Object.values(reduce(data, (allTypes, { monthData, id }) => {
  if (!lockId || lockId === id) {
    monthData.forEach(m => {
      m.types.forEach((type) => {
        allTypes[type.id] = allTypes[type.id] || keys.reduce((df, k) => {
          df[k] = 0
          return df
        }, { id: type.id, name: type.name })
        keys.forEach(k => {
          allTypes[type.id][k] += type.data[k]
        })
      })
    })
  }
  return allTypes
}, {}))

export const getMonthData = (data, activeType, lockId) => data.reduce((md, d) => {
  if (!lockId || lockId === d.id) {
    d.monthData.forEach((m) => {
      md[m.month] = md[m.month] || { month: m.month }
      keys.forEach((key) => {
        md[m.month][key] = md[m.month][key] || 0
        md[m.month][key] += (activeType ? m.types[activeType].data[key] : m.data[key])
      }, {})
    })
  }
  return md
}, {})

export const mapData = data => map(data, ({ id, name, monthData, hasChildren }) => ({
  label: name,
  id,
  monthData,
  hasChildren,
}))
