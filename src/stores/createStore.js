/**
 * Create the store with dynamic reducers
 */

import { applyMiddleware, createStore, compose } from 'redux';
import { fromJS } from 'immutable';
import { createResponsiveStoreEnhancer } from 'redux-responsive';
import createSagaMiddleware from 'redux-saga';

import apiSagas from '../services/api/sagas';
import createReducer from './reducers';

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancers = [
    applyMiddleware(...middlewares),
    createResponsiveStoreEnhancer({ calculateInitialState: false }),
  ];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    (process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
  /* eslint-enable */

  const store = createStore(
    createReducer(),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  // Extensions

  store.runSaga = sagaMiddleware.run;
  sagaMiddleware.run(apiSagas);
  store.injectedReducers = {}; // Reducer registry

  return store;
}
