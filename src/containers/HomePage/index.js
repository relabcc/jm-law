import React, { PureComponent, createElement } from 'react'
import map from 'lodash/map'
import reduce from 'lodash/reduce'

import Container from 'components/Container'
import Box from 'components/Box'
import Flex from 'components/Flex'
import Toggler from 'components/Toggler'

import theme, { mobileOrDesktop } from 'components/ThemeProvider/theme';

import withData from 'services/api/withData'

import Layout from '../Layout';
import BubbleLine from './BubbleLine'
import TypeDonut from './TypeDonut'
import PercentBars from './PercentBars'

const keys = [
  'canceled',
  'canceledDollar',
  'issued',
  'issuedDollar',
  'received',
  'receivedDollar',
]

const typeOrders= [
  '待履行費用案件',
  '怠金案件',
  '罰緩案件',
  '其他案件',
]

const typeLegends = typeOrders.map((label, i) => ({
  label,
  color: theme.colors.spectrum[theme.colors.spectrum.length - 1 - i],
}))

class IndexPage extends PureComponent {
  static getDerivedStateFromProps(nexProps) {
    const data = nexProps['data/bureaus']
    const mappedData = map(data, ({ name, monthData }) => ({
      label: name,
      monthData: monthData.map(m => ({
        ...m,
        types: m.types.reduce((t, td) => {
          t[td.name] = td
          return t
        },{})
      }))
    }))
    return { mappedData }
  }

  state = {
    sortBy: 'receiveRate',
    sortOrder: 'asc',
    chartIndex: 0,
  }

  handleTypeFilter = (activeType) => this.setState({ activeType })

  handleChartToggle = chartIndex => this.setState({ chartIndex })

  render() {
    const data = this.props['data/bureaus']
    const { updateParams } = this.props
    const {
      sortBy,
      sortOrder,
      chartIndex,
      activeType,
      mappedData
    } = this.state
    const bureauTotal = mappedData.map(({ label, monthData }) => ({
      label,
      ...keys.reduce((allData, key) => {
        allData[key] = monthData.reduce((all, { data, types }) => all + (activeType ? types[activeType].data[key] : data[key]), 0)
        return allData
      }, {})
    })).map((d) => ({
      ...d,
      receiveRate: d.received / d.issued,
      receiveDollarRate: d.receivedDollar / d.issuedDollar,
    }))
    const types = Object.values(reduce(data, (allTypes, { monthData }) => {
      monthData.forEach(m => {
        m.types.forEach((type) => {
          allTypes[type.id] = allTypes[type.id] || { id: type.id, name: type.name, issued: 0, received: 0 }
          allTypes[type.id].issued += type.data.issued
          allTypes[type.id].received += type.data.received
        })
      })
      return allTypes
    }, {}))
    return (
      <Layout>
        <Container py={mobileOrDesktop(0, '2em')}>
          <select onChange={e => updateParams({ year: e.target.value })}>
            {[2019, 2018, 2017].map(y => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <BubbleLine ratio={1 / 4} data={bureauTotal} sortBy={sortBy} sortOrder={sortOrder} />
        </Container>
        <Box
          py={mobileOrDesktop(0, '2em')}
          backgroundImage={`linear-gradient(to right, ${theme.colors.darkBlue}, ${theme.colors.darkerBlue})`}
        >
          <Container>
            <Flex mx="-1em" borderBottom="1px solid white">
              <Box px="1em" width={1 / 3} borderRight="1px solid white">
                <Box position="relative">
                  {createElement(chartIndex ? PercentBars : TypeDonut , {
                    ratio: 3 / 4,
                    data: types,
                    legends: typeLegends,
                    onLegendClick: this.handleTypeFilter,
                    activeLegend: activeType,
                  })}
                  <Box position="absolute" top="0" left="0">
                    <Toggler activeIndex={chartIndex} onToggle={this.handleChartToggle} options={['案件數', '收繳率']} />
                  </Box>
                </Box>
              </Box>
              <Box px="1em" width={2 / 3}></Box>
            </Flex>
          </Container>
        </Box>
      </Layout>
    )
  }
}


export default withData('data/bureaus')(IndexPage)
