import reduce from 'lodash/reduce'

const keys = [
  'canceled',
  'canceledDollar',
  'issued',
  'issuedDollar',
  'received',
  'receivedDollar',
]

export const getBureauTotal = (data, activeType) => data.map(({ label, monthData }) => ({
  label,
  ...keys.reduce((allData, key) => {
    allData[key] = monthData.reduce((all, d) => all + (activeType ? d.types[activeType].data[key] : d.data[key]), 0)
    return allData
  }, {})
})).map((d) => ({
  ...d,
  receiveRate: d.received / d.issued,
  receiveDollarRate: d.receivedDollar / d.issuedDollar,
}))

export const getTypes = data => Object.values(reduce(data, (allTypes, { monthData }) => {
  monthData.forEach(m => {
    m.types.forEach((type) => {
      allTypes[type.id] = allTypes[type.id] || { id: type.id, name: type.name, issued: 0, received: 0 }
      allTypes[type.id].issued += type.data.issued
      allTypes[type.id].received += type.data.received
    })
  })
  return allTypes
}, {}))

export const getMonthData = (data, activeType) => data.reduce((md, d) => {
  d.monthData.forEach((m) => {
    md[m.month] = md[m.month] || { month: m.month }
    keys.forEach((key) => {
      md[m.month][key] = md[m.month][key] || 0
      md[m.month][key] += (activeType ? m.types[activeType].data[key] : m.data[key])
    }, {})
  })
  return md
}, {})
