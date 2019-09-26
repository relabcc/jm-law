import map from 'lodash/map'
import reduce from 'lodash/reduce'

const keys = [
  'canceled',
  'canceledDollar',
  'issued',
  'issuedDollar',
  'received',
  'receivedDollar',
]

export const getBureauTotal = (data, activeType) => data.map(({ label, id, monthData }) => ({
  label,
  id,
  ...keys.reduce((allData, key) => {
    allData[key] = monthData.reduce((all, d) => all + (activeType ? d.types[activeType].data[key] : d.data[key]), 0)
    return allData
  }, {})
})).map((d) => ({
  ...d,
  receiveRate: d.received / d.issued,
  receiveDollarRate: d.receivedDollar / d.issuedDollar,
}))

export const getTypes = (data, lockId) => Object.values(reduce(data, (allTypes, { monthData, id }) => {
  if (!lockId || lockId === id) {
    monthData.forEach(m => {
      m.types.forEach((type) => {
        allTypes[type.id] = allTypes[type.id] || { id: type.id, name: type.name, issued: 0, received: 0 }
        allTypes[type.id].issued += type.data.issued
        allTypes[type.id].received += type.data.received
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

export const mapData = data => map(data, ({ id, name, monthData }) => ({
  label: name,
  id,
  monthData: monthData.map(m => ({
    ...m,
    types: m.types.reduce((t, td) => {
      t[td.name] = td
      return t
    },{})
  }))
}))
