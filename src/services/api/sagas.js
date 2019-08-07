import { all, call, put, takeEvery } from 'redux-saga/effects';
import { actionTypes } from 'redux-resource';
import reduce from 'lodash/reduce'

import sendRequest from 'utils/request';

import { API_BASE } from './config';

const processData = data => data

function* handleRequest(target, onSuccess, onError) {
  try {
    const res = yield call(sendRequest, target);
    yield put(onSuccess(res));
  } catch (error) {
    console.error(error)
    yield put(onError(error));
  }
}

function* handleRead({ resourceType, resources, requestKey, requestParams }) {
  const resourceBase = `${API_BASE}/${resourceType}${requestParams ? reduce(requestParams, (q, value, key) => `${q}${key}=${encodeURIComponent(value)}`, '?'): ''}`;
  if (resources) {
    yield all(
      resources.map(id =>
        call(
          handleRequest,
          // target
          `${resourceBase}/${id}`,
          // onSuccess
          data => ({
            type: actionTypes.READ_RESOURCES_SUCCEEDED,
            resourceType,
            resources: [processData(data)],
          }),
          // onError
          () => ({
            type: actionTypes.READ_RESOURCES_FAILED,
            resourceType,
            resources: [id],
          }),
        ),
      ),
    );
  } else {
    yield call(
      handleRequest,
      resourceBase,
      data => ({
        type: actionTypes.READ_RESOURCES_SUCCEEDED,
        resourceType,
        resources: data.map(processData),
        requestKey,
      }),
      // onError
      () => ({
        type: actionTypes.READ_RESOURCES_FAILED,
        resourceType,
        requestKey,
      }),
    );
  }
}

export default function* apiSagas() {
  yield takeEvery(actionTypes.READ_RESOURCES_PENDING, handleRead);
}
