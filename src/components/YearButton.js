import React, { createElement, PureComponent } from 'react';
import { IoMdArrowDropleft,  IoMdArrowDropright} from 'react-icons/io';

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
      <Flex alignItems="center" {...props}>
        {createElement(darkBg ? Button.lightBg : Button, {
          px: '0.125em',
          py: '0.125em',
          borderRadius: '0.25em',
          disabled: !activeYear,
          onClick: this.handleLastYear,
        }, <IoMdArrowDropleft size="1.5em" />)}
        <Box px="1.5em" py="0.375em" border="1px solid" mx="0.5em" borderRadius="0.5em">
          {years[activeYear]}
        </Box>
        {createElement(darkBg ? Button.lightBg : Button, {
          px: '0.125em',
          py: '0.125em',
          borderRadius: '0.25em',
          disabled: activeYear === years.length - 1,
          onClick: this.handleNextYear,
        }, <IoMdArrowDropright size="1.5em" />)}
      </Flex>
    );
  }
}

export default YearButton;
