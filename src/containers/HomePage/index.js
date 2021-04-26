import React, { PureComponent, createElement } from 'react'
import { compose } from 'redux'
import last from 'lodash/last'

import Container from '../../components/Container'
import Box from '../../components/Box'
import Flex from '../../components/Flex'
import Text from '../../components/Text'
import Button from '../../components/Button'
import YearButton from '../../components/YearButton'
import PatternBg from '../../components/PatternBg';
import Image from '../../components/Image';

import theme, { mobileOrDesktop } from '../../components/ThemeProvider/theme';

import withBureauData from '../../services/api/withBureauData'
import withDataState from '../../services/api/withDataState'

import Layout from '../Layout';
import BubbleLine from './BubbleLine'
import YearChart from './YearChart'
// import AvgDays from './AvgDays'
import LastUpdated from './LastUpdated'

import legend from './legend.svg'

import {
  getBureauTotal,
  getMonthData,
  mapData,
} from './dataHandler'

const isTopBureau = window.__SHOW_BUREAU_ID === '00000000'
const singleBureau = isTopBureau && window.__BUREAU_ID !== '00000000'

class IndexPage extends PureComponent {
  static getDerivedStateFromProps(nexProps) {
    const { data } = nexProps
    const mappedData = mapData(data)

    return { mappedData }
  }

  state = {
    sortBy: 'receiveRate',
    sortOrder: 'asc',
    chartIndex: 0,
    publicOnly: 0,
    typeLegends: [],
    year: last(this.props.yearsList),
    lockId: singleBureau ? window.__BUREAU_ID : null,
    typeOptions: [],
  }

  handleTypeFilter = activeType => this.setState({ activeType })

  handleChartToggle = chartIndex => this.setState({ chartIndex })

  handleYearChange = year => {
    const { updateParams } = this.props
    updateParams({ year })
    this.setState({ year })
  }

  setPublicOnly = publicOnly => this.setState({ publicOnly })

  setLock = lockId => this.setState({ lockId })

  handleReset = () => this.setState({
    lockId: singleBureau ? window.__BUREAU_ID : null,
    chartIndex: 0,
    publicOnly: 0,
    activeType: null,
  })

  render() {
    const { yearsList: years } = this.props
    const {
      sortBy,
      sortOrder,
      activeType,
      mappedData,
      year,
      lockId,
    } = this.state

    const bureauTotal = getBureauTotal(mappedData, activeType)
    const monthData = getMonthData(mappedData, activeType, lockId)
    return (
      <Layout>
        <Box>
          <PatternBg pt="2em" pb="3em">
            <Container>
              <Flex alignItems="center">
                <Text mr="0.75em" fontSize="1.5em" fontWeight="bold" letterSpacing="0.15em">各單位案件量分析</Text>
                  <YearButton
                    currentYear={year}
                    years={years}
                    onChange={this.handleYearChange}
                  />
                <Box flex="1" />
                <LastUpdated />
              </Flex>
              <Box textAlign="right" my="1em">
                <Button onClick={() => window.history.back()}>切回上層</Button>
              </Box>
              <BubbleLine
                ratio={1 / 4}
                data={bureauTotal}
                sortBy={sortBy}
                sortOrder={sortOrder}
                lockId={lockId}
                onLock={this.setLock}
              />
            </Container>
          </PatternBg>
        </Box>
        <Box
          py={mobileOrDesktop(0, '2em')}
          gradient="lightBlue"
        >
          <Container>
            <Flex px="5%" py="2em" alignItems="center">
              <Box px="2em">
                <YearButton
                  justifyContent="center"
                  darkBg
                  currentYear={year}
                  years={years}
                  onChange={this.handleYearChange}
                />
                <Box fontSize="1.5em" letterSpacing="0.15em" my="1em" borderBottom="1px solid" pb="0.5rem">月案件量分析</Box>
                <Box fontSize="1.25em">
                  <Flex my="1em" justifyContent="center">
                    <Text>案件量</Text>
                    <Box ml="1em" width="3em">
                      <Image src={legend} />
                    </Box>
                  </Flex>
                  <Flex my="1em" justifyContent="center">
                    <Text>收繳率</Text>
                    <Box ml="1em" width="3em" height="1em" bg="#B6E6EB" />
                  </Flex>
                </Box>
              </Box>
              <Box flex="1" bg="white" px="2em" py="1em" borderRadius="2em">
                <YearChart ratio={1 / 5} data={monthData} />
              </Box>
            </Flex>
          </Container>
        </Box>
      </Layout>
    )
  }
}


export default compose(
  withDataState('yearsList'),
  withBureauData,
)(IndexPage)
