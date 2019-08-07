import React from 'react'
import Box from 'components/Box';
import Flex from 'components/Flex';
import Text from 'components/Text';
import Link from 'components/Link';

const Header = ({ siteTitle, ...props }) => (
  <Flex
    position="fixed"
    bg="primary"
    top={0}
    left={0}
    right={0}
    alignItems="center"
    zOrder={2}
    {...props}
  >
    <Box px="1em" flex={1}>
      <Text.h1>
        <Link to="/" color="white">
          {siteTitle}
        </Link>
      </Text.h1>
    </Box>
    <Box px="1em">
    </Box>
  </Flex>
)

export default Header
