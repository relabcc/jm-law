import React, { createElement, PureComponent } from 'react';
import { IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';

import Box from './Box'
import Flex from './Flex'
import Button from './Button'

class YearButton extends PureComponent {
  static defaultProps = {
    onChange: () => {},
  }

  static getDerivedStateFromProps({ currentYear, years }, prevState) {
    return {
      activeYear: typeof currentYear === 'undefined' ? years.length - 1 : years.findIndex(y => y === currentYear),
    }
  }

  state = {}

  handleNextYear = () => {
    const { activeYear } = this.state
    const newYear = activeYear + 1
    this.setState({ activeYear: newYear }, () => {
      this.props.onChange(this.props.years[newYear])
    })
  }

  handleLastYear = () => {
    const { activeYear } = this.state
    const newYear = activeYear - 1
    this.setState({ activeYear: newYear }, () => {
      this.props.onChange(this.props.years[newYear])
    })
  }

  render() {
    const { currentYear, years, darkBg, onChange, ...props} = this.props
    const { activeYear } = this.state
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        bg={darkBg ? 'white' : 'lightGray'}
        px="0.5em"
        py="0.25em"
        borderRadius="999px"
        {...props}
      >
        {createElement(Button, {
          px: 0,
          py: 0,
          width: '1.5em',
          height: '1.5em',
          borderRadius: '100%',
          disabled: !activeYear,
          onClick: this.handleLastYear,
        }, <IoIosArrowBack size="1em" />)}
        <Box px="2em" fontWeight="bold" fontSize="1.25em">
          {years[activeYear]}
        </Box>
        {createElement(Button, {
          px: 0,
          py: 0,
          width: '1.5em',
          height: '1.5em',
          borderRadius: '100%',
          disabled: activeYear === years.length - 1,
          onClick: this.handleNextYear,
        }, <IoIosArrowForward size="1em" />)}
      </Flex>
    );
  }
}

export default YearButton;
