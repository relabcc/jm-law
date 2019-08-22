import React, { PureComponent, createElement } from 'react'
import map from 'lodash/map'
import reduce from 'lodash/reduce'

import Container from 'components/Container'
import Box from 'components/Box'
import Flex from 'components/Flex'
import Text from 'components/Text'
import Button from 'components/Button'
import Toggler from 'components/Toggler'

import theme, { mobileOrDesktop } from 'components/ThemeProvider/theme';

import withData from 'services/api/withData'

import Layout from '../Layout';
import BubbleLine from './BubbleLine'
import TypeDonut from './TypeDonut'
import PercentBars from './PercentBars'
import LawTop5 from './LawTop5'

const keys = [
  'canceled',
  'canceledDollar',
  'issued',
  'issuedDollar',
  'received',
  'receivedDollar',
]

const years = [
  { value: 2019, label: 108 },
  { value: 2018, label: 107 },
  { value: 2017, label: 106 },
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
        <Box
          py="4em"
          backgroundImage={`linear-gradient(#fff 80%, #e0e0e4 100%)`}
        >
          <Container>
            <select onChange={e => updateParams({ year: e.target.value })}>
              {years.map(y => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
            <BubbleLine ratio={1 / 4} data={bureauTotal} sortBy={sortBy} sortOrder={sortOrder} />
          </Container>
        </Box>
        <Box
          py={mobileOrDesktop(0, '2em')}
          color="white"
          backgroundImage={`linear-gradient(to right, ${theme.colors.darkBlue}, ${theme.colors.darkerBlue})`}
        >
          <Container>
            <Flex borderBottom="1px solid">
              <Box pl="1em" pr="2em" width={1 / 3} borderRight="1px solid">
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
              <Box pl="2em" pr="1em" width={2 / 3}>
                <Flex pt="0.5em" pb="1.25em" alignItems="center" borderBottom="1px solid">
                  <Text fontSize="1.5em"><Text.inline letterSpacing="0.15em">違反法條</Text.inline> TOP 5</Text>
                  <Button mx="2em">查看更多</Button>
                  <Box flex="1" />
                  <Text>繳款入市庫平均日數： 5 天</Text>
                </Flex>
                <LawTop5 />
              </Box>
            </Flex>
          </Container>
        </Box>
      </Layout>
    )
  }
}


export default withData('data/bureaus')(IndexPage)
