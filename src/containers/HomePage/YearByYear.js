import React, { PureComponent, createElement } from 'react';
import { compose } from 'redux'

import Box from 'components/Box'
import Flex from 'components/Flex'
import Toggler from 'components/Toggler'

import withDataState from 'services/api/withDataState'

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
    console.log(data)
    return (
      <Box position="relative" mx="4em">
        <Box pt="66%" border="1px solid"></Box>
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
          <Box ml="2em">
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
