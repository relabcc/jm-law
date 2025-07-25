import merge from 'lodash/merge';
import range from 'lodash/range';

const emToPx = (em) => `${em * 16}px`;

export const breakpoints = [22, 36, 48, 62, 90, 120].map(emToPx);
export const containerWidth = [22, 36, 46, 58].map(emToPx);
export const mobileOrDesktop = (mobile, desktop) => [mobile, null, null, desktop];

const generateFade = (r, g, b) => range(10, 100, 10)
  .reduce((fade, opacity) => merge(fade, { [opacity]: `rgba(${[r, g, b, opacity / 100].join()})` }), {});


const font = 'Comfortaa, Arial, "PingFang TC", "HeiTi TC", "Microsoft JhengHei", sans-serif';

const spectrum = [
  '#d3b998',
  '#a57c56',
  '#e8c52e',
  '#ffa329',
  '#f2690c',
  '#d32e02',
]

const darkBlue = '#2d3555'
const darkerBlue = '#171835'
const textBlue = '#1E213E'
const textYellow = '#F2B817'
const dropdownBg = '#E7EAF6'

const white = '#fff';
const black = '#000';
const text = '#040000';
const gray = '#7d7e80'
const lightGray = '#c9caca'
const darkGray = '#4c4948'
const orange = spectrum[3]
const darkOrange = spectrum[4]
const lightOrange = spectrum[2]
const darkRed = spectrum[5]
const oranges = spectrum.reduce((o, c, i) => {
  o[`orange${i + 1}`] = c;
  return o
}, {});
const primary = darkOrange;

export default {
  colors: {
    white,
    black,
    gray,
    dropdownBg,
    textYellow,
    lightGray,
    darkGray,
    textBlue,
    darkBlue,
    darkerBlue,
    orange,
    darkOrange,
    lightOrange,
    darkRed,
    text,
    primary,
    primaryHover: darkOrange,
    spectrum,
    ...oranges,
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
  gradients: {
    none: {},
    darkBlue: {
      backgroundImage: `linear-gradient(to right, ${darkBlue}, ${darkerBlue})`,
      color: white,
    },
  }
};
