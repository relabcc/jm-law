import React from 'react'

import Container from '../../components/Container'
import Box from '../../components/Box'
import Link from '../../components/Link'
import Flex from '../../components/Flex'
import Text from '../../components/Text'
import PatternBg from '../../components/PatternBg';
import LineBg from '../../components/LineBg';

import withDataState from '../../services/api/withDataState'

import Layout from '../Layout';
// {label.replace(String.fromCharCode(92).concat('n'), '\n')}

const Module = ({ color, value, label, unit, datas, ...props}) => (
  <Flex flexWrap="wrap" px="4em" {...props}>
    {datas.map(({ value, label, unit, url }, index) => (
      <Box pr="1em" width={1 / 3} key={index}>
        <Box bg="#f4f4f4" my="1em" borderRadius="5em" py="1.5em">
          <Flex alignItems="center" px="2em">
            <Box width="7.5em" textAlign="right" borderRight="2px solid" pr="1em" py="0.5em">
              <Text.inline fontSize="2em" color={color}>{value}</Text.inline>
              <Text.inline pl="0.25em">{unit}</Text.inline>
            </Box>
            <Box flex="1" pl="1em" py="0.5em">
              {url ? <Link href={url}>{label}</Link> : label}
            </Box>
          </Flex>
        </Box>
      </Box>
    ))}
  </Flex>
)

const SummaryPage = ({ summary }) => {
  const primarys = summary.primary;
  const secondarys = summary.secondary

  return (
    <Layout>
      <PatternBg py="2em">
        <Container>
          <Module datas={primarys} color="textYellow" my="2em" />
          <LineBg>
            <Box height="2em" />
          </LineBg>
          <Module datas={secondarys} color="textBlue" />
        </Container>
      </PatternBg>
    </Layout>
  )
}


export default withDataState('summary', window.__DEPARTMENT_ID && { departmentId: window.__DEPARTMENT_ID })(SummaryPage)
