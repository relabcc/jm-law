import React, { PureComponent, createElement } from 'react'
import map from 'lodash/map'
import reduce from 'lodash/reduce'

import Container from 'components/Container'
import Box from 'components/Box'
import Flex from 'components/Flex'
import Text from 'components/Text'
import Button from 'components/Button'
import YearButton from 'components/YearButton'
import Toggler from 'components/Toggler'
import Dropdown from 'components/Dropdown';
import Modal from 'components/Modal';

import theme, { mobileOrDesktop } from 'components/ThemeProvider/theme';

import withData from 'services/api/withData'

import Layout from '../Layout';
import BubbleLine from './BubbleLine'
import TypeDonut from './TypeDonut'
import PercentBars from './PercentBars'
import LawTop5 from './LawTop5'
import YearChart from './YearChart'

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
    currentYear: 0,
  }

  handleTypeFilter = (activeType) => this.setState({ activeType })

  handleChartToggle = chartIndex => this.setState({ chartIndex })

  handleNextYear = (currentYear) => this.setState({ currentYear: currentYear - 1  })
  handleLastYear = (currentYear) => this.setState({ currentYear: currentYear + 1  })

  openModal = () => this.setState({ open: true })
  CloseModal = () => this.setState({ open: false })

  handleYearChange = e => {
    const { updateParams } = this.props
    const year = e.target.value
    updateParams({ year })
    this.setState({ year })
  }

  render() {
    const data = this.props['data/bureaus']
    const {
      sortBy,
      sortOrder,
      chartIndex,
      activeType,
      currentYear,
      open,
      mappedData,
      year,
    } = this.state
    const bureauTotal = mappedData.map(({ label, monthData }) => ({
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
    const monthData = mappedData.reduce((md, d) => {
      d.monthData.forEach((m) => {
        md[m.month] = md[m.month] || {}
        keys.forEach((key) => {
          md[m.month][key] = md[m.month][key] || 0
          md[m.month][key] += (activeType ? m.types[activeType].data[key] : m.data[key])
        }, {})
      })
      return md
    }, {})
    return (
      <Layout>
        <Box
          py="4em"
          backgroundImage={`linear-gradient(#fff 80%, #e0e0e4 100%)`}
        >
          <Box mx={mobileOrDesktop('1em', '2em')} my="1em" color="darkBlue">
            <Flex alignItems="center">
              <Text mr="0.75em" fontSize="1.25em" fontWeight="bold" letterSpacing="0.15em">案件類別</Text>
              <Box width="12em" py="1em">
                <Dropdown options={typeOrders} />
              </Box>
            </Flex>
            <Flex alignItems="center">
              <Text mr="0.75em" fontSize="1.25em" fontWeight="bold" letterSpacing="0.15em">各局處案件量分析</Text>
              <YearButton
                currentYear={currentYear}
                years={years}
                handleNextYear={() => this.handleNextYear(currentYear)}
                handleLastYear={() => this.handleLastYear(currentYear)}
              />
            </Flex>
          </Box>
          <Container>
            <select onChange={this.handleYearChange}>
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
                  <Button.lightBg onClick={this.openModal} mx="2em">查看更多</Button.lightBg>
                  <Modal isOpen={open} onRequestClose={this.CloseModal} title="違反法條TOP10">
                    <Button.border>所有法條分析</Button.border>
                  </Modal>
                  <Box flex="1" />
                  <Text>繳款入市庫平均日數： 5 天</Text>
                </Flex>
                <LawTop5 year={year} />
              </Box>
            </Flex>
            <Flex px="5%" py="2em" alignItems="center">
              <Box px="2em">
                <YearButton
                  justifyContent="center"
                  darkBg
                  currentYear={currentYear}
                  years={years}
                  handleNextYear={() => this.handleNextYear(currentYear)}
                  handleLastYear={() => this.handleLastYear(currentYear)}
                />
                <Box fontSize="1.5em" letterSpacing="0.15em" my="1em" borderBottom="1px solid" pb="0.5rem">月案件量分析</Box>
                <Box textAlign="center">
                  <Button.lightBg>看歷年分析</Button.lightBg>
                </Box>
              </Box>
              <Box flex="1">
                <YearChart ratio={1 / 5} data={monthData} />
              </Box>
            </Flex>
          </Container>
        </Box>
      </Layout>
    )
  }
}


export default withData('data/bureaus')(IndexPage)
