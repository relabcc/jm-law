import React from 'react';
import styled, { css } from 'styled-components';
import {
  typography,
  space,
  color,
  layout,
  border,
  borderRadius,
  backgroundImage,
  position,
  borderColor,
} from 'styled-system';
import themeGet from '@styled-system/theme-get';
import tag from 'clean-tag';

import Box from './Box';
import theme from './ThemeProvider/theme';

import { customColor } from './utils/getColor';
import blacklist from './utils/blacklist';

const active = css`
  ${customColor('hoverColor')};
  ${customColor('hoverBg', 'backgroundColor')};
  ${customColor('hoverBgImg', 'backgroundImage')};
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
  ${backgroundImage}
  ${space}
  ${color}
  ${border}
  ${borderColor}
  ${borderRadius}
  appearance: none;
  transition: all ${themeGet('duration', 250)}ms;
  cursor: pointer;
  &:hover {
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
  border: '1px solid',
  borderColor: 'darkBlue',
  bg: 'darkBlue',
  backgroundImage: `linear-gradient(to right, ${theme.colors.darkBlue}, ${theme.colors.darkerBlue})`,
  color: 'white',
  hoverColor: 'darkBlue',
  hoverBg: 'white',
  hoverBgImg: 'none',
  hoverBorder: 'darkBlue',
  px: '1.25em',
  py: '0.5em',
  fontWeight: 'bold',
  iconSpacing: '0.25em',
  borderRadius: '1.25em',
  display: 'inline-block',
  verticalAlign: 'middle',
};

Button.displayName = 'Button';

Button.lightBg = props => (
  <Button
    bg="white"
    color="darkBlue"
    backgroundImage="white"
    border="1px solid"
    borderColor="white"
    hoverColor="white"
    hoverBgImg={`linear-gradient(to right, ${theme.colors.darkBlue}, ${theme.colors.darkerBlue})`}
    hoverBorder="white"
    {...props}
  />
);

Button.border = props => (
  <Button
    bg="white"
    color="darkBlue"
    backgroundImage="white"
    borderColor="darkBlue"
    hoverColor="white"
    hoverBg="none"
    hoverBgImg={`linear-gradient(to right, ${theme.colors.darkBlue}, ${theme.colors.darkerBlue})`}
    {...props}
  />
);

Button.outline = props => (
  <Button
    border="1px solid"
    borderColor="primary"
    bg="transparent"
    color="primary"
    hoverColor="white"
    {...props}
  />
);

Button.outline.danger = props => (
  <Button.danger
    border="1px solid"
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
