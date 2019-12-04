import React, { PureComponent, createElement } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import size from 'lodash/size';
import md5 from 'blueimp-md5'

import Text from '../../components/Text';
import { getData } from './reducer'

import { STATUS_LOADED, STATUS_LOADING, STATUS_ERROR } from './constants'

export default (key, params) => {
  const SIG = `_LAW.state.${md5(key + params ? JSON.stringify(params) : '')}`

  return SubComp => {
    if (!key) return () => null;
    if (typeof window !== 'undefined' && window[SIG]) return window[SIG];

    class WithData extends PureComponent {
      state = {}

      componentDidMount() {
        setTimeout(this.request);
      }

      request = (skip, newParams) => {
        if (!this.checkIsPending()) {
          if (skip || !this.checkIsDone()) {
            this.props.getData({ key, params: newParams || params })
          }
        }
      };

      checkIsPending = () => this.props.status === STATUS_LOADING

      checkIsDone = () => this.props.status === STATUS_LOADED || this.props.status === STATUS_ERROR

      render() {
        const { data, status, ...props } = this.props
        let content = <Text textAlign="center" my="2em">Loading...</Text>;
        if (size(data)) {
          content = createElement(SubComp, {
            ...props,
            [key]: data,
            resync: (newParams) => this.request(true, newParams),
            // isLoading: this.checkIsPending(),
          });
        }
        return content
      }
    }

    const mapStateToProps = state => ({
      data: state.getIn(['api', key, 'data']),
      status: state.getIn(['api', key, 'status']),
    })

    const mapDispatchToProps = dispatch => bindActionCreators({
      getData,
    }, dispatch)
    return connect(mapStateToProps, mapDispatchToProps)(WithData)
  };
}
