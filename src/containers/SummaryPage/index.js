import React, { useState, Fragment, PureComponent } from 'react'

import Container from '../../components/Container'
import Box from '../../components/Box'
import Link from '../../components/Link'
import Flex from '../../components/Flex'
import Text from '../../components/Text'
import PatternBg from '../../components/PatternBg';
import LineBg from '../../components/LineBg';
import Dropdown from '../../components/Dropdown';

import withDataState from '../../services/api/withDataState'

import Layout from '../Layout';

const Module = ({ color, value, label, unit, datas, ...props}) => (
  <Flex flexWrap="wrap" px="4em" {...props}>
    {datas.map(({ value, label, unit, url }, index) => (
      <Box pr="1em" width={1 / 3} key={index}>
        <Box is={url && (p => <Link href={url} display="block" {...p} />)} bg="#f4f4f4" my="1em" borderRadius="5em" py="1.5em">
          <Flex alignItems="center" px="2em">
            <Box width="7.5em" textAlign="right" borderRight="2px solid" pr="1em" py="0.5em">
              <Text.inline fontSize="2em" color={color}>{value}</Text.inline>
              <Text.inline pl="0.25em">{unit}</Text.inline>
            </Box>
            <Box flex="1" pl="1em" py="0.5em">
              {label}
            </Box>
          </Flex>
        </Box>
      </Box>
    ))}
  </Flex>
)

class SummaryPage extends PureComponent {
  componentDidUpdate(prevProps) {
    const { type, resync } = this.props

    if (type !== prevProps.type) {
      resync(type ? { type } : {})
    }
  }

  render() {
    const { summary } = this.props
    const primarys = summary.primary;
    const secondarys = summary.secondary
    return (
      <Fragment>
        <Module datas={primarys} color="textYellow" my="2em" />
        <LineBg>
          <Box height="2em" />
        </LineBg>
        <Module datas={secondarys} color="textBlue" />
      </Fragment>
    )
  }
}

const TypeSummary = withDataState(
  'summary',
  window.__DEPARTMENT_ID && { departmentId: window.__DEPARTMENT_ID }
)(SummaryPage)

const TypeWrapper = ({ typeList }) => {
  const [type, handleTypeFilter] = useState('')

  return (
    <Layout>
      <PatternBg py="2em">
        <Container>
          <Flex py="1em" alignItems="center">
            <Text mr="0.75em" fontSize="1.25em" fontWeight="bold" letterSpacing="0.15em">案件類別</Text>
            <Box width="12em">
              <Dropdown
                value={type}
                options={typeList.map(({ name, id }) => ({ value: id, label: name }))}
                onChange={({ value }) => handleTypeFilter(value)}
              />
            </Box>
          </Flex>
          <TypeSummary type={type} />
        </Container>
      </PatternBg>
    </Layout>
  )
}

export default withDataState('typeList')(TypeWrapper)
