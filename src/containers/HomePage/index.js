import React, { PureComponent, createElement } from 'react'
import { compose } from 'redux'
import map from 'lodash/map'
import last from 'lodash/last'

import Container from 'components/Container'
import Box from 'components/Box'
import Flex from 'components/Flex'
import Text from 'components/Text'
import Button from 'components/Button'
import YearButton from 'components/YearButton'
import Toggler from 'components/Toggler'
import Dropdown from 'components/Dropdown';
import ModalButton from 'components/ModalButton';

import theme, { mobileOrDesktop } from 'components/ThemeProvider/theme';

import withBureauData from 'services/api/withBureauData'
import withDataState from 'services/api/withDataState'

import Layout from '../Layout';
import BubbleLine from './BubbleLine'
import TypeDonut from './TypeDonut'
import PercentBars from './PercentBars'
import LawTops from './LawTops'
import YearChart from './YearChart'
import AvgDays from './AvgDays'
import YearByYear from './YearByYear'

import {
  getBureauTotal,
  getMonthData,
  getTypes,
} from './dataHandler'

class IndexPage extends PureComponent {
  static getDerivedStateFromProps(nexProps) {
    const data = nexProps['data/bureaus']
    const { typeList } = nexProps
    const mappedData = map(data, ({ id, name, monthData }) => ({
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
    const typeLegends = typeList.map(({ name }, i) => ({
      label: name,
      color: theme.colors.spectrum[theme.colors.spectrum.length - 1 - i],
    }))
    return { mappedData, typeLegends }
  }

  state = {
    sortBy: 'receiveRate',
    sortOrder: 'asc',
    chartIndex: 0,
    lawType: 0,
    typeLegends: [],
    year: last(this.props.yearsList),
  }

  handleTypeFilter = (activeType) => this.setState({ activeType })

  handleChartToggle = chartIndex => this.setState({ chartIndex })

  handleYearChange = year => {
    const { updateParams } = this.props
    updateParams({ year })
    this.setState({ year })
  }

  setLawType = lawType => this.setState({ lawType })

  setLock = lockId => this.setState({ lockId })

  render() {
    const data = this.props['data/bureaus']
    const { typeList, yearsList: years } = this.props
    const {
      sortBy,
      sortOrder,
      chartIndex,
      activeType,
      mappedData,
      year,
      lawType,
      typeLegends,
      lockId,
    } = this.state

    const bureauTotal = getBureauTotal(mappedData, activeType)
    const monthData = getMonthData(mappedData, activeType, lockId)
    const types = getTypes(data, lockId)
    return (
      <Layout>
        <Box
          py="4em"
          backgroundImage={`linear-gradient(#fff 80%, #e0e0e4 100%)`}
        >
          <Container>
            <Flex alignItems="center">
              <Text mr="0.75em" fontSize="1.25em" fontWeight="bold" letterSpacing="0.15em">案件類別</Text>
              <Box width="12em" py="1em">
                <Dropdown
                  placeholder="全部"
                  value={activeType}
                  options={typeList.map(({ name }) => name)}
                  onChange={({ value }) => this.handleTypeFilter(value)}
                />
              </Box>
            </Flex>
            <Flex alignItems="center">
              <Text mr="0.75em" fontSize="1.25em" fontWeight="bold" letterSpacing="0.15em">各局處案件量分析</Text>
              <YearButton
                currentYear={year}
                years={years}
                onChange={this.handleYearChange}
              />
            </Flex>
            <BubbleLine
              ratio={1 / 4}
              data={bureauTotal}
              sortBy={sortBy}
              sortOrder={sortOrder}
              lockId={lockId}
              onLock={this.setLock}
            />
          </Container>
        </Box>
        <Box
          py={mobileOrDesktop(0, '2em')}
          gradient="darkBlue"
        >
          <Container>
            <Flex borderBottom="1px solid">
              <Box pl="1em" pr="2em" width={2 / 5} borderRight="1px solid">
                <Box position="relative">
                  {createElement(chartIndex ? PercentBars : TypeDonut , Object.assign({
                    ratio: 0.6,
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
                        <Box px="15%">
                          <TypeDonut
                            ratio={1}
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
                          <Button active={lawType === 0} onClick={() => this.setLawType(0)}>所有法條分析</Button>
                        </Box>
                        <Box my="1em">
                          <Button active={lawType === 1} onClick={() => this.setLawType(1)}>公安法條分析</Button>
                        </Box>
                      </Box>
                      <Box flex="1" px="2em">
                        <LawTops key={10} top={10} year={year} color="text" ratio={0.8} lockId={lockId} />
                      </Box>
                    </Flex>
                  </ModalButton>
                  <Box flex="1" />
                  <AvgDays year={year} />
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
                      label="查看更多"
                      title={`${year - 2}-${year}案件量分析`}
                    >
                      <YearByYear year={year} />
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
