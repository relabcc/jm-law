import React from 'react';
import styled, { css } from 'styled-components';
import {
  typography,
  space,
  color,
  layout,
  border,
  borderRadius,
  position,
} from 'styled-system';
import themeGet from '@styled-system/theme-get';
import tag from 'clean-tag';

import Box from './Box';

import { customColor } from './utils/getColor';
import blacklist from './utils/blacklist';

const active = css`
  ${customColor('hoverColor')};
  ${customColor('hoverBg', 'backgroundColor')};
  ${customColor('hoverBorder', 'borderColor')};
`;

export const buttonStyle = css`
  padding: 0;
  border: none;
  font-family: inherit;
  line-height: 1;
  text-decoration: none;
  ${typography}
  ${layout}
  ${position}
  ${space}
  ${color}
  ${border}
  ${borderRadius}
  appearance: none;
  transition: all ${themeGet('duration', 250)}ms;
  cursor: pointer;
  &:hover,
  &:focus {
    ${props => !props.disabled && active}
    outline: none;
  }
  ${props => props.active && !props.disabled && active}
  ${props =>
    props.disabled &&
    `
    cursor: not-allowed;
    opacity: 0.5;
  `}
`;

const ButtonBase = styled(tag)`
  ${buttonStyle};
`;

const InButtonSpan = props => <Box is="span" {...props} />;

const Button = ({
  leftIcon,
  rightIcon,
  iconSpacing,
  children,
  verticalAlign,
  ...props
}) => (
  <ButtonBase {...props}>
    {leftIcon ? (
      <Box is={leftIcon} mr={iconSpacing} verticalAlign={verticalAlign} />
    ) : null}
    <InButtonSpan verticalAlign={verticalAlign}>{children}</InButtonSpan>
    {rightIcon ? (
      <Box is={rightIcon} ml={iconSpacing} verticalAlign={verticalAlign} />
    ) : null}
  </ButtonBase>
);

Button.defaultProps = {
  blacklist,
  is: 'button',
  border: '2px solid',
  borderColor: 'primary',
  bg: 'primary',
  color: 'white',
  hoverColor: 'white',
  hoverBg: 'primaryHover',
  hoverBorder: 'primaryHover',
  px: '1.5em',
  py: '0.75em',
  fontWeight: 'bold',
  iconSpacing: '0.25em',
  borderRadius: '0.25em',
  display: 'inline-block',
  verticalAlign: 'middle',
};

Button.displayName = 'Button';

Button.danger = props => (
  <Button
    bg="danger"
    borderColor="danger"
    hoverBg="dangerHover"
    hoverBorder="dangerHover"
    {...props}
  />
);

Button.secondary = props => (
  <Button
    bg="secondary"
    borderColor="secondary"
    hoverBg="secondaryHover"
    hoverBorder="secondaryHover"
    {...props}
  />
);

Button.outline = props => (
  <Button
    border="2px solid"
    borderColor="primary"
    bg="transparent"
    color="primary"
    hoverColor="white"
    {...props}
  />
);

Button.outline.danger = props => (
  <Button.danger
    border="2px solid"
    borderColor="danger"
    bg="transparent"
    color="danger"
    hoverColor="white"
    {...props}
  />
);

Button.transparent = props => (
  <Button
    border="1px solid transparent"
    bg="transparent"
    color="text"
    hoverBorder="primary"
    {...props}
  />
);

export default Button;
