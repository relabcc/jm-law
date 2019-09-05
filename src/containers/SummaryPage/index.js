import React, { PureComponent } from 'react'

import Container from '../../components/Container'
import Box from '../../components/Box'
import Flex from '../../components/Flex'
import Text from '../../components/Text'

import theme, { mobileOrDesktop } from '../../components/ThemeProvider/theme';

import withDataState from '../../services/api/withDataState'

import Layout from '../Layout';


class SummaryPage extends PureComponent {
  state = {}

  render() {
    const { summary } = this.props
    console.log(summary)
    return (
      <Layout>
        <Container>
          <Text>Summary</Text>
        </Container>
      </Layout>
    )
  }
}


export default withDataState('summary')(SummaryPage)
