import React, { PureComponent } from 'react'
import map from 'lodash/map'
import reduce from 'lodash/reduce'

import Container from 'components/Container'
import Box from 'components/Box'
import Flex from 'components/Flex'

import theme, { mobileOrDesktop } from 'components/ThemeProvider/theme';

import withData from 'services/api/withData'

import Layout from '../Layout';
import BubbleLine from './BubbleLine'
import TypeDonut from './TypeDonut'

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
    console.log('total', bureauTotal)
    return (
      <Layout>
        <Container py={mobileOrDesktop(0, '2em')}>
          <select onChange={e => updateParams({ year: e.target.value })}>
            {[2019, 2018, 2017].map(y => (
              <option key={y}>{y}</option>
            ))}
          </select>
          <BubbleLine ratio={1 / 4} data={bureauTotal} sortBy={sortBy} sortOrder={sortOrder} />
        </Container>
        <Box
          py={mobileOrDesktop(0, '2em')}
          backgroundImage={`linear-gradient(to right, ${theme.colors.darkBlue}, ${theme.colors.darkerBlue})`}
        >
          <Container>
            <Flex mx="-1em">
              <Box mx="1em" width={1 / 3}>
                <TypeDonut ratio={3 / 4} data={types} />
              </Box>
              <Box mx="1em" width={2 / 3}></Box>
            </Flex>
          </Container>
        </Box>
      </Layout>
    )
  }
}


export default withData('data/bureaus')(IndexPage)
