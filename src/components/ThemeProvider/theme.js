import merge from 'lodash/merge';
import range from 'lodash/range';
import mapValues from 'lodash/mapValues';

import colors from 'open-color/open-color.json';

const emToPx = (em) => `${em * 16}px`;

export const breakpoints = [22, 36, 48, 62, 90, 120].map(emToPx);
export const containerWidth = [22, 36, 46, 58].map(emToPx);
export const mobileOrDesktop = (mobile, desktop) => [mobile, null, null, desktop];

const generateFade = (r, g, b) => range(10, 100, 10)
  .reduce((fade, opacity) => merge(fade, { [opacity]: `rgba(${[r, g, b, opacity / 100].join()})` }), {});

const flatternColors = mapValues(colors, (listOfColors) => listOfColors[5]);

const font = 'Comfortaa, Arial, "PingFang TC", "HeiTi TC", "Microsoft JhengHei", sans-serif';

const white = '#fff';
const black = '#000';
const text = '#292340';
const gray = '#7d7e80'
const lightGray = '#bbbdbf'
const darkGray = '#4d4d4f'
const orange = '#f1a820'
const darkOrange = '#ea8034'
const lightOrange = '#ffcf6d'
const darkRed = '#ae2119'
const primary = orange;
const secondary = 'green';
const danger = 'red';

export default {
  colors: {
    ...flatternColors,
    white,
    black,
    gray,
    lightGray,
    darkGray,
    orange,
    darkOrange,
    lightOrange,
    darkRed,
    text,
    primary,
    primaryHover: darkOrange,
    danger: flatternColors[danger],
    dangerHover: colors[danger][9],
    dangerVariations: colors[danger],
    secondary: flatternColors[secondary],
    secondaryHover: colors[secondary][9],
    secondaryVariations: colors[secondary],
    variations: colors,
    fade: {
      white: generateFade(255, 255, 255),
      black: generateFade(0, 0, 0),
    },
  },
  breakpoints,
  containerWidth,
  font,
  headerHeight: '5em',
  mobileOrDesktop,
  zOrder: range(4).map((i) => 10 ** i),
};
