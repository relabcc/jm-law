import React, { createElement } from 'react';
import get from 'lodash/get'
// import format from 'date-fns/format'

import Text from '../../components/Text'
import withDataState from '../../services/api/withDataState'

const LastUpdated = ({ lastUpdated }) => {
  return (
    <Text fontSize="0.875em">資料更新日期：{get(lastUpdated, 'date')}</Text>
  );
}

export default props => createElement(withDataState('lastUpdated')(LastUpdated), props);
