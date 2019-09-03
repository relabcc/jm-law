import React from 'react'
import PropTypes from 'prop-types'

import Box from '../../components/Box';

const Layout = ({ children }) => (
  <Box height="100vh" minWidth="800px">
    {children}
  </Box>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
