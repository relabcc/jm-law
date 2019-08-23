import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styled from 'styled-components';

import themeGet from '@styled-system/theme-get';
import Box from './Box'

import withResponsive from '../hoc/withResponsive'

const StyledDropdown = styled(Dropdown)`
  .Dropdown-control {
    border: 1px solid;
    border-radius: 0.5em;
    text-align: center;
    background-color: white;
    color: black;
    font-family: inherit;
    padding: 0.25em;
    font-size: 1em;
    cursor: pointer;
    transition: none;
  }
  &.is-open {
    .Dropdown-control {
      border-radius: 0.5em 0.5em 0em 0em;
    }
  }
  .Dropdown-menu {
    border: 1px solid;
    transform: translateY(1px);
    border-radius: 0 0 0.5em 0.5em;
  }
  .Dropdown-option {
    color: inherit;
    text-align: center;
    padding: 0.5em 1em;
    border-bottom: 1px solid gray;
    &.is-selected {
      background-color: ${themeGet('colors.dropdownBg')};
    }
    &:hover {
      background-color: ${themeGet('colors.dropdownBg')};
    }
  }
  .Dropdown-arrow {
    border-color: black transparent transparent;
    top: 0.8em;
    right: 0.5em;
  }
`

const CustomDropdown = ({
  isMobile,
  options,
  onChange,
  onBlur,
  value,
  name,
  placeholder,
  disabled,
  ...props
}) => {
  return (
    <Box {...props}>
      <StyledDropdown
        onChange={onChange}
        options={[{ label: '全部', value: '' }].concat(options.map(value => ({ value, label: value })))}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
      />
    </Box>
  );
};

CustomDropdown.defaultProps = {
  placeholder: '請選擇',
  onChange: () => {}
}

export default withResponsive(CustomDropdown);
