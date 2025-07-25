import React, { PureComponent, createElement } from 'react'
import { compose } from 'redux'
import last from 'lodash/last'

import Container from '../../components/Container'
import Box from '../../components/Box'
import Flex from '../../components/Flex'
import Text from '../../components/Text'
import Button from '../../components/Button'
import YearButton from '../../components/YearButton'
import Toggler from '../../components/Toggler'
import Dropdown from '../../components/Dropdown';
import ModalButton from '../../components/ModalButton';
import PatternBg from '../../components/PatternBg';

import theme, { mobileOrDesktop } from '../../components/ThemeProvider/theme';

import withBureauData from '../../services/api/withBureauData'
import withDataState from '../../services/api/withDataState'

import Layout from '../Layout';
import BubbleLine from './BubbleLine'
import TypeDonut from './TypeDonut'
import PercentBars from './PercentBars'
import LawTops from './LawTops'
import YearChart from './YearChart'
// import AvgDays from './AvgDays'
import YearByYear from './YearByYear'
import LastUpdated from './LastUpdated'

import {
  getBureauTotal,
  getMonthData,
  getTypes,
  mapData,
} from './dataHandler'

const isTopBureau = window.__SHOW_BUREAU_ID === '00000000'
const singleBureau = isTopBureau && window.__BUREAU_ID !== '00000000'

class IndexPage extends PureComponent {
  static getDerivedStateFromProps(nexProps) {
    const { typeList, data } = nexProps
    const mappedData = mapData(data)
    const typeLegends = typeList.map(({ name, id }, i) => ({
      id,
      label: name,
      color: theme.colors.spectrum[theme.colors.spectrum.length - 1 - i],
    }))
    const typeOptions = typeList.map(({ name, id }) => ({ label: name, value: id }))
    return { mappedData, typeLegends, typeOptions }
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
    const { data, yearsList: years } = this.props
    const {
      sortBy,
      sortOrder,
      chartIndex,
      activeType,
      mappedData,
      year,
      publicOnly,
      typeLegends,
      lockId,
      typeOptions,
    } = this.state

    const bureauTotal = getBureauTotal(mappedData, activeType)
    const monthData = getMonthData(mappedData, activeType, lockId)
    const types = getTypes(data, lockId)
    return (
      <Layout>
        <Box backgroundImage="linear-gradient(#fff 80%, #e0e0e4 100%)">
          <PatternBg pt="2em" pb="3em">
            <Container>
              <Flex alignItems="center">
                <Text mr="0.75em" fontSize="1.25em" fontWeight="bold" letterSpacing="0.15em">案件類別</Text>
                <Box width="12em" py="1em">
                  <Dropdown
                    placeholder="全部"
                    value={activeType}
                    options={typeOptions}
                    onChange={({ value }) => this.handleTypeFilter(value)}
                  />
                </Box>
                <Box flex="1" />
                <LastUpdated />
              </Flex>
              <Flex alignItems="center">
                <Text mr="0.75em" fontSize="1.25em" fontWeight="bold" letterSpacing="0.15em">各{isTopBureau ? '局處' : '科室'}案件量分析</Text>
                <YearButton
                  currentYear={year}
                  years={years}
                  onChange={this.handleYearChange}
                />
              </Flex>
              <Box textAlign="right" my="1em">
                {!isTopBureau && <Button onClick={() => window.history.back()} mr="1em">返回全局處</Button>}
                <Button onClick={this.handleReset}>切回預設</Button>
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
          gradient="darkBlue"
        >
          <Container>
            <Flex borderBottom="1px solid">
              <Box pl="1em" pr="2em" pb="1em" width={2 / 5} borderRight="1px solid">
                <Box position="relative">
                  {createElement(chartIndex ? PercentBars : TypeDonut , Object.assign({
                    ratio: 0.66,
                    data: types,
                    legends: typeLegends,
                    onLegendClick: this.handleTypeFilter,
                    activeLegend: activeType,
                  }, chartIndex ? {} : {
                    valueGetter: d => d.issued,
                    outerCircle: true,
                    showLegend: true,
                  }))}
                  <Box position="absolute" top="0" left="0">
                    <Toggler activeIndex={chartIndex} onToggle={this.handleChartToggle} options={['案件數', '收繳率']} />
                  </Box>
                  <Box position="absolute" right="0" bottom="0">
                    {!chartIndex && (
                      <ModalButton
                        is={Button.lightBg}
                        label="查看更多"
                        title="案件分類分析"
                      >
                        <Box px="10%">
                          <TypeDonut
                            ratio={0.7}
                            valueGetter={d => d.issued}
                            data={types}
                            showPercentage
                            legends={typeLegends}
                            showLabel
                          />
                        </Box>
                      </ModalButton>
                    )}
                  </Box>
                </Box>
              </Box>
              <Box pl="2em" pr="1em" width={3 / 5}>
                <Flex pt="0.5em" pb="1.25em" alignItems="center" borderBottom="1px solid">
                  <Text fontSize="1.5em"><Text.inline letterSpacing="0.15em">違反法條</Text.inline> TOP 5</Text>
                  <ModalButton
                    is={Button.lightBg}
                    label="查看更多"
                    title="違反法條TOP10"
                    mx="2em"
                  >
                    <Flex alignItems="center">
                      <Box mx="2em">
                        <Box my="1em">
                          <Button active={publicOnly === 0} onClick={() => this.setPublicOnly(0)}>所有法條分析</Button>
                        </Box>
                        <Box my="1em">
                          <Button active={publicOnly === true} onClick={() => this.setPublicOnly(true)}>公安法條分析</Button>
                        </Box>
                      </Box>
                      <Box flex="1" px="2em">
                        <LawTops key={10} top={10} year={year} color="text" ratio={0.77} publicOnly={publicOnly} lockId={lockId} />
                      </Box>
                    </Flex>
                  </ModalButton>
                  {/* <Box flex="1" /> */}
                  {/* <AvgDays year={year} /> */}
                </Flex>
                <LawTops key={5} year={year} top={5} hasLine color="white" ratio={0.35} lockId={lockId} />
              </Box>
            </Flex>
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
                <Box textAlign="center">
                  <ModalButton
                    is={Button.lightBg}
                    label="看歷年分析"
                    title={`${year - 2}-${year}案件量分析`}
                  >
                    <YearByYear year={year} activeType={activeType} lockId={lockId} />
                  </ModalButton>
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


export default compose(
  withDataState('yearsList'),
  withDataState('typeList'),
  withBureauData,
)(IndexPage)
