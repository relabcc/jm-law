import React from 'react';
import Modal from 'react-modal';
import merge from 'lodash/merge'
import { IoIosClose } from "react-icons/io";

import Box from './Box'
import Flex from './Flex'
import Text from './Text'
import Button from './Button'
import Circle from './Circle'
import theme from './ThemeProvider/theme'

const defaultStyles = {
  overlay: {
    zIndex: theme.zOrder[3],
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
  content: {
    width: '66%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1em',
    border: 'none',
    padding: '0',
    backgroundColor: 'rgba(255,255,255,0.9)',
    overflow: 'unset',
  }
};

Modal.setAppElement('#root')

export default ({ children, border, borderRadius, customStyles, title, ...props }) => (
  <Modal
    style={merge({}, defaultStyles, { content: customStyles})}
    {...props}
  >
    <Box py="1.5em">
      <Flex justifyContent="space-between" mx="2em" pb="1em" borderBottom="1px solid" borderColor="darkBlue" alignItems="center">
        <Text fontWeight="bold" letterSpacing="0.25em" fontSize="1.25em">{title}</Text>
        <Circle width="2em" is={(p) => <Button borderRadius="50%" px="0" py="0" {...p} />} onClick={props.onRequestClose}>
          <IoIosClose size="2em" />
        </Circle>
      </Flex>
      <Box m="1.5em" position="relative">
        {children}
      </Box>
    </Box>
  </Modal>
)
