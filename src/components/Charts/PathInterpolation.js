import React, { Component } from 'react';

import { Animate } from 'react-move'
import { interpolate } from 'flubber'

class PathInterpolation extends Component {
  static getDerivedStateFromProps({ d }, { thisD }) {
    return {
      thisD: d,
      prevD: thisD,
    }
  }

  static defaultProps = {
    duration: 200,
  }

  state = {
    prevD: this.props.d,
    thisD: this.props.d,
  }

  render() {
    const { d, duration, ...props } = this.props
    const { prevD, thisD } = this.state

    if (!prevD) {
      return (
        <path
          d={d}
          {...props}
        />
      )
    }

    const interpolator = interpolate(prevD, thisD)
    return (
      <Animate
        start={{
          d: interpolator(1),
        }}
        enter={[
          {
            timing: { duration },
          },
        ]}
        update={{
          d: interpolator,
          timing: { duration },
        }}
      >
        {(state) => (
          <path
            {...state}
            {...props}
          />
        )}
      </Animate>
    );
  }
}

export default PathInterpolation
