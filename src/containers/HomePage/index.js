import React, { PureComponent } from 'react'
import map from 'lodash/map'

import Container from 'components/Container'
import Box from 'components/Box'
import Flex from 'components/Flex'
import Button from 'components/Button'

import { mobileOrDesktop } from 'components/ThemeProvider/theme';

import withData from 'services/api/withData'

import Layout from '../Layout';
import BubbleLine from './BubbleLine'

const keys = [
  'canceled',
  'canceledDollar',
  'issued',
  'issuedDollar',
  'received',
  'receivedDollar',
]

class IndexPage extends PureComponent {
  state = {
    sortBy: 'receiveRate',
    sortOrder: 'asc',
  }

  render() {
    const data = this.props['data/bureaus']
    const { updateParams } = this.props
    const { sortBy, sortOrder } = this.state
    const bureauTotal = map(data, ({ name, monthData }) => ({
      label: name,
      ...keys.reduce((allData, key) => {
        allData[key] = monthData.reduce((all, { data }) => all + data[key], 0)
        return allData
      }, {})
    })).map((d) => ({
      ...d,
      receiveRate: d.received / d.issued,
      receiveDollarRate: d.receivedDollar / d.issuedDollar,
    }))
    console.log('total', bureauTotal)
    return (
      <Layout>
        <Container py={mobileOrDesktop(0, '2em')}>
          <Box>
            <select onChange={e => updateParams({ year: e.target.value })}>
              {[2019, 2018, 2017].map(y => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </Box>
          <BubbleLine ratio={1 / 3} data={bureauTotal} sortBy={sortBy} sortOrder={sortOrder} />
        </Container>
      </Layout>
    )
  }
}


export default withData('data/bureaus')(IndexPage)
