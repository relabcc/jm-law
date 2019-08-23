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
    width: '90%',
    maxWidth: '40em',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '1em',
    border: 'none',
    padding: '0',
    backgroundColor: 'white',
    overflow: 'unset',
  }
};

Modal.setAppElement('#___gatsby')

export default ({ children, border, borderRadius, customStyles, title, ...props }) => (
  <Modal
    style={merge({}, defaultStyles, { content: customStyles})}
    {...props}
  >
    <Flex justifyContent="space-between" mx="2em" py="1em" borderBottom="1px solid" borderColor="darkBlue">
      <Text letterSpacing="0.25em" fontSize="1.25em">{title}</Text>
      <Circle width="2em" is={(p) => <Button borderRadius="50%" px="0" py="0" {...p} />} onClick={props.onRequestClose}>
        <IoIosClose size="2em" />
      </Circle>
    </Flex>
    <Box p="2em" position="relative">
      {children}
    </Box>
  </Modal>
)
