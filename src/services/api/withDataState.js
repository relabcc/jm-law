import React, { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { actionTypes, requestStatuses, resourceReducer } from 'redux-resource';
import get from 'lodash/get';
import size from 'lodash/size';
import md5 from 'blueimp-md5'

import Text from '../../components/Text';
import request from '../../utils/request';
import { API_BASE } from './config';

export default (key) => {
  const SIG = `_LAW.${md5(key)}`

  return SubComp => {
    if (!key) return () => null;
    if (typeof window !== 'undefined' && window[SIG]) return window[SIG];

    class WithData extends PureComponent {
      state = {}

      componentDidMount() {
        setTimeout(this.request);
      }

      request = () => {
        request(`${API_BASE}/${key}`).then(this.handleRes)
      };

      handleRes = data => {
        this.setState({ data })
      }

      render() {
        const { data } = this.state
        let content = <Text textAlign="center" my="2em">Loading...</Text>;
        if (size(data)) {
          content = createElement(SubComp, {
            ...this.props,
            [key]: data,
            // resync: this.resync,
            // isLoading: this.checkIsPending(),
          });
        }
        return content
      }
    }

    return WithData
  };
}
