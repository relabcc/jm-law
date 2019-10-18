import React, { PureComponent, createRef } from 'react';
import TWEEN from '@tweenjs/tween.js';
import { SVGPathData, encodeSVGPath } from 'svg-pathdata';
import pickBy from 'lodash/pickBy';
import isNumber from 'lodash/isNumber';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';

function animate() {
	requestAnimationFrame(animate);
	TWEEN.update();
}

class TweenShape extends PureComponent {
  static defaultProps = {
    duration: 500,
  }

  constructor(props) {
    super(props);
    const { d } = props;
    this.prevParsed = new SVGPathData(d).toAbs().commands;
    this.tick = [];
    animate();
  }

  componentDidUpdate(prevProps) {
    const { d } = this.props;
    if (d !== prevProps.d) this.updatePath(d);
  }

  componentWillUnmount() {
    if (this.tweens) {
      this.tweens.forEach((tween) => tween.stop());
    }
  }

  pathRef = createRef()

  updatePath = (d) => {
    this.parsed = new SVGPathData(d).toAbs().commands;
    this.tweens = this.parsed.map((to, index) => {
      const from = this.prevParsed[index];
      const toValues = pickBy(to, isNumber);
      const tween = new TWEEN.Tween(from || mapValues(toValues, (v, k) => k === 'type' ? v : 0))
        .to(toValues, this.props.duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(this.handleUpdate(index))
      tween.start();
      return tween;
    });
  }

  handleUpdate = (index) => (value) => {
    this.prevParsed[index] = merge(this.prevParsed[index] || {}, value);
    this.tick[index] = true;
    if (this.tick.length === this.parsed.length && this.tick.every(Boolean)) {
      this.doUpdatePath();
    }
  }

  doUpdatePath = () => {
    if (this.pathRef.current) {
      try {
        const encoded = encodeSVGPath(this.prevParsed)
        this.pathRef.current.setAttribute('d', encoded);
      } catch {

      }
    }
    this.tick.fill(null);
  }

  render() {
    const { duration, ...props } = this.props
    return (
      <path ref={this.pathRef} style={props.onClick ? { cursor: 'pointer' } : {}} {...props} />
    );
  }
}

export default TweenShape;

