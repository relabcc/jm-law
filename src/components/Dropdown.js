import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import styled, { css } from 'styled-components';

import themeGet from '@styled-system/theme-get';
import Box from './Box'

import withResponsive from '../hoc/withResponsive'

const Wrapper = styled(Box)`
  position: relative;
  &::after {
    ${({ isMobile }) => isMobile && 'content: "";'}
    display: block;
    position: absolute;
    border-style: solid;
    border-width: 5px 5px 0;
    border-color: ${themeGet('colors.primary')} transparent transparent;
    top: 1.4em;
    right: 0.5em;
  }
`

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
    <Wrapper isMobile={isMobile} {...props}>
      <StyledDropdown
        onChange={e => onChange({ target: { name, value: e.value }, persist: () => {} })}
        options={options}
        value={value && Object.assign({}, options[+value], { value })}
        placeholder={placeholder}
        disabled={disabled}
      />
    </Wrapper>
  );
};

CustomDropdown.defaultProps = {
  placeholder: '請選擇',
  onChange: () => {}
}

export default withResponsive(CustomDropdown);
