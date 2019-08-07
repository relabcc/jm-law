import React from 'react'
import map from 'lodash/map'

import Container from 'components/Container'
import Box from 'components/Box'
import Flex from 'components/Flex'
import BubbleLine from 'components/Charts/BubbleLine'
import Button from 'components/Button'

import { mobileOrDesktop } from 'components/ThemeProvider/theme';

import withData from 'services/api/withData'

import Layout from '../Layout';

const keys = [
  'canceled',
  'canceledDollar',
  'issued',
  'issuedDollar',
  'received',
  'receivedDollar',
]

const IndexPage = (props) => {
  const data = props['data/bureaus']
  const { updateParams } = props
  const bureauTotal = map(data, ({ name, monthData }) => ({
    label: name,
    ...keys.reduce((allData, key) => {
      allData[key] = monthData.reduce((all, { data }) => all + data[key], 0)
      return allData
    }, {})
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
        <BubbleLine data={bureauTotal.map(({ label, issued }) => ({ label, value: issued }))} />
      </Container>
    </Layout>
  )
}

export default withData('data/bureaus')(IndexPage)
