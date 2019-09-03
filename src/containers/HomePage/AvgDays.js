import React, { PureComponent, createElement } from 'react';
import get from 'lodash/get'

import Text from '../../components/Text'
import withData from '../../services/api/withData'

class AvgDays extends PureComponent {
  componentDidUpdate(prevProps, prevState) {
    const { year, updateParams } = this.props
    if (prevProps.year !== year) {
      updateParams({ year })
    }
  }

  render() {
    const { year } = this.props
    const avgDays = this.props['data/avgTransferDays']
    return (
      <Text>繳款入市庫平均日數：{get(avgDays, [year, 'days'])} 天</Text>
    );
  }
}

export default props => createElement(withData('data/avgTransferDays', { year: props.year })(AvgDays), props);
