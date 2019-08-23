import React from 'react';
import Modal from 'react-modal';
import merge from 'lodash/merge'
import { IoIosClose } from "react-icons/io";

import Box from './Box'
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

export default ({ children, border, borderRadius, customStyles, ...props }) => (
  <Modal
    style={merge({}, defaultStyles, { content: customStyles})}
    {...props}
  >
    <Box p="2em" position="relative">
      {children}
      <Box width="2em" position="absolute" top="1.25em" right="2em">
        <Circle is={(p) => <Button borderRadius="50%" px="0" py="0" {...p} />} onClick={props.onRequestClose}>
          <IoIosClose size="2em" />
        </Circle>
      </Box>
    </Box>
  </Modal>
)
