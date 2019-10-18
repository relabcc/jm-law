import React, { PureComponent } from 'react'

import Container from '../../components/Container'
import Box from '../../components/Box'
import Flex from '../../components/Flex'
import Text from '../../components/Text'
import PatternBg from '../../components/PatternBg';
import LineBg from '../../components/LineBg';

import withDataState from '../../services/api/withDataState'

import Layout from '../Layout';

class SummaryPage extends PureComponent {
  state = {}

  render() {
    const { summary } = this.props
    console.log(summary)
    const primarys = summary.primary;
    const secondarys = summary.secondary
    const Module = ({ color, value, label, unit, datas, ...props}) => (
      <Flex flexWrap="wrap" px="5em" {...props}>
        {datas.map(({value, label, unit}, index) => (
          <Box px="2em" width={1/3} key={index}>
            <Box bg="lightGray" my="2em" borderRadius="5em" py="1.5em">
              <Flex alignItems="center">
                <Box width={3/10} textAlign="right" borderRight="2px solid" pr="1em" py="0.5em">
                  <Text.inline fontSize="2em" color={color}>{value}</Text.inline>
                  <Text.inline pl="0.25em">{unit}</Text.inline>
                </Box>
                <Box width={7/10} whiteSpace="pre" pl="1em" py="0.5em">
                  {label.replace(String.fromCharCode(92).concat('n'), '\n')}
                </Box>
              </Flex>
            </Box>
          </Box>
        ))}
      </Flex>
    )
    return (
      <Layout>
        <PatternBg py="2em">
          <Container>
            <Box fontSize="1.5em" borderBottom="1px solid" py="0.75em">
              <Text letterSpacing={2} fontWeight="bold" color="textBlue">案件情況</Text>
            </Box>
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
}


export default withDataState('summary', window.__DEPARTMENT_ID && { departmentId: window.__DEPARTMENT_ID })(SummaryPage)
