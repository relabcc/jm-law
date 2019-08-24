import { fromJS } from 'immutable';
import { createAction, handleActions } from 'redux-actions'

import {
  STATUS_ERROR,
  STATUS_LOADED,
  STATUS_LOADING,
} from './constants'

export const GET_DATA = 'API/GET_DATA'

export const getData = createAction(GET_DATA)
export const receivedDataSuccess = createAction('API/RECEIVED_DATA_SUCCESS')
export const receivedDataError = createAction('API/RECEIVED_DATA_ERROR')

const initialState = fromJS({})

const reducer = handleActions({
  [getData]: (state, { payload: { key } }) => state.setIn([key, 'status'], STATUS_LOADING),
  [receivedDataSuccess]: (state, { payload: { key, data } }) => state
    .setIn([key, 'status'], STATUS_LOADED)
    .setIn([key, 'data'], data),
  [receivedDataError]: (state, { payload: { key } }) => state.setIn([key, 'status'], STATUS_ERROR),
}, initialState)

export default reducer
