/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import fromPairs from 'lodash/fromPairs';
import zip from 'lodash/zip';
import { createResponsiveStateReducer } from 'redux-responsive';

import { breakpoints } from '../components/ThemeProvider/theme';

const names = [
  'xxs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
];

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    browser: createResponsiveStateReducer(fromPairs(zip(names, breakpoints.map((bp) => parseInt(bp, 10) - 1)))),
    ...injectedReducers,
  });
}
