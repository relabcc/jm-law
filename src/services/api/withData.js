import React, { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { actionTypes, requestStatuses, resourceReducer } from 'redux-resource';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import size from 'lodash/size';
import md5 from 'blueimp-md5'

import Text from '../../components/Text';
import injectReducer from '../../utils/injectReducer';

export default (key, params, transformer) => {
  const ids = (isArray(params) || isNumber(params)) ? params : '';
  const listMode = !ids;
  const resources = isArray(ids) ? ids : [ids];
  const SIG = `_LAW.${md5(`${key}${ids}${params ? JSON.stringify(params) : ''}`)}`

  return SubComp => {
    if (!key) return () => null;
    if (typeof window !== 'undefined' && window[SIG]) return window[SIG];

    class WithData extends PureComponent {
      componentDidMount() {
        setTimeout(this.request);
      }

      // shouldComponentUpdate(nextProps) {
      //   return get(this.props, [key, 'resources']) !== get(nextProps, [key, 'resources'])
      // }

      request = (skip, requestParams = params) => {
        if (this.props[key]) {
          if (!this.checkIsPending()) {
            if (skip || !this.checkIsDone()) {
              this.props.dispatch({
                type: actionTypes.READ_RESOURCES_PENDING,
                resourceType: key,
                resources: listMode ? undefined : resources,
                requestKey: listMode && `list${JSON.stringify(params)}`,
                requestParams,
                transformer,
              });
            }
          }
        } else {
          setTimeout(this.request, 100)
        }
      };

      resync = () => this.request(true);

      updateParams = (params) => this.request(true, params);

      checkStatus = status => {
        if (listMode) {
          return (
            get(this.props, [
              key,
              'requests',
              'list',
              'status',
            ]) === status
          );
        }
        return (
          get(this.props, [
            key,
            'meta',
            resources,
            'readStatus'
          ]) === status
        );
      };

      checkIsPending = () => this.checkStatus(requestStatuses.PENDING);

      checkIsDone = () => this.checkStatus(requestStatuses.SUCCEEDED) || this.checkStatus(requestStatuses.FAILED);

      render() {
        const data = get(this.props, [key, 'resources']);
        let content = <Text textAlign="center" my="2em">Loading...</Text>;
        if (size(data)) {
          content = createElement(SubComp, {
            ...this.props,
            [key]: data,
            updateParams: this.updateParams,
            // resync: this.resync,
            // isLoading: this.checkIsPending(),
          });
        }
        return content
      }
    }

    const mapStateToProps = state => ({
      [key]: state.get(key),
    });

    const withReducer = injectReducer({
      key: key,
      reducer: resourceReducer(key),
    });

    const comp = compose(
      withReducer,
      connect(mapStateToProps),
    )(WithData)
    if (typeof window !== 'undefined') window[SIG] = comp

    return comp
  };
}
