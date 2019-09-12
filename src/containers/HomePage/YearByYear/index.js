import React, { PureComponent, createElement } from 'react';
import { compose } from 'redux'
import reduce from 'lodash/reduce'
import forEach from 'lodash/forEach'
import groupBy from 'lodash/groupBy'

import Box from '../../../components/Box'
import Flex from '../../../components/Flex'
import Toggler from '../../../components/Toggler'

import withDataState from '../../../services/api/withDataState'

import IssuedChart from './IssuedChart'
import ReceivedChart from './ReceivedChart'

import { getMonthData } from '../dataHandler'
import theme from '../../../components/ThemeProvider/theme';

const parseData = (d, initial) => {
  const parsed = reduce(d, (va, { month, ...vv }) => {
    Object.keys(vv).forEach(k => {
      va[k] = va[k] || 0
      va[k] += vv[k]
    })
    return va
  }, initial)
  parsed.receivedRate = parsed.received / parsed.issued
  return parsed
}

const colors = [
  theme.colors.orange3,
  theme.colors.orange5,
  theme.colors.orange4,
];

class YearByYear extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    const { year } = nextProps
    return {
      data: {
        [year]: nextProps[`data/bureaus?year=${year}`],
        [year - 1]: nextProps[`data/bureaus?year=${year - 1}`],
        [year - 2]: nextProps[`data/bureaus?year=${year - 2}`],
      }
    }
  }

  state = {
    chartType: 0,
    timeType: 0,
  }

  handleToggle = key => value => this.setState({ [key]: value })

  render() {
    const { data, chartType, timeType } = this.state
    const { year } = this.props
    const formattedData = reduce(data, (fd, d, year) => {
      let md = getMonthData(d.data)
      if (timeType) {
        md = groupBy(md, (dd) => Math.floor((dd.month - 1) / 3))
        forEach(md, (v, i) => {
          fd.push(parseData(v, {
            year,
            quarter: +i + 1,
            index: (year - this.props.year + 2) * 4 + i * 1,
          }))
        })
      } else {
        fd.push(parseData(md, {
          year,
          index: year - this.props.year + 2,
        }))
      }
      return fd
    }, [])
    const dataLength = formattedData.length
    return (
      <Box position="relative" mx="4em">
        {createElement(chartType ? ReceivedChart : IssuedChart, {
          key: `t-${timeType}`,
          data: formattedData,
          ratio: 0.66,
          getFill: i => {
            let c = i
            if (timeType) {
              c = Math.floor(i / 4)
            }
            return colors[c]
          },
          xTickFormat: d => {
            if (timeType) {
              const y = Math.floor(d / 4)
              return year - (dataLength / 4 - y) + 1 + '第' + (d % 4 + 1) + '季'
            }
            return year - (dataLength - d) + 1
          },
        })}
        <Flex position="absolute" width={1} top="0">
          <Box>
            <Toggler
              color="darkBlue"
              bg="rgba(0,0,0,0.2)"
              options={['案件數', '收繳率']}
              activeIndex={chartType}
              onToggle={this.handleToggle('chartType')}
            />
          </Box>
          <Box ml="1em">
            <Toggler
              color="darkBlue"
              bg="rgba(0,0,0,0.2)"
              options={['年', '季']}
              activeIndex={timeType}
              onToggle={this.handleToggle('timeType')}
            />
          </Box>
        </Flex>
      </Box>
    );
  }
}

export default (props) => createElement(compose(
  withDataState(`data/bureaus?year=${props.year}`),
  withDataState(`data/bureaus?year=${props.year - 1}`),
  withDataState(`data/bureaus?year=${props.year - 2}`),
)(YearByYear), props);
