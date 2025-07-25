import React, { PureComponent, createRef } from 'react';
import TWEEN from '@tweenjs/tween.js';
import { SVGPathData, encodeSVGPath } from 'svg-pathdata';
import pickBy from 'lodash/pickBy';
import size from 'lodash/size';
import merge from 'lodash/merge';

function animate() {
	requestAnimationFrame(animate);
	TWEEN.update();
}

const blacklist = {
  type: true,
  relative: true,
  lArcFlag: true,
  sweepFlag: true,
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
    this.tickShape = [];
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
      const fromValues = pickBy(from, (v, k) => !blacklist[k]);
      const toValues = pickBy(to, (v, k) => !blacklist[k]);
      if (size(toValues)) {
        this.tickShape[index] = false;
        const tween = new TWEEN.Tween(fromValues)
          .to(toValues, this.props.duration)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(this.handleUpdate(index))
        tween.start();
        return tween;
      }
      this.tick[index] = true;
      this.tickShape[index] = true;
      return {
        stop: () => {},
      };
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
    this.tick = Array.from(this.tickShape)
  }

  render() {
    const { duration, ...props } = this.props
    return (
      <path ref={this.pathRef} style={props.onClick ? { cursor: 'pointer' } : {}} {...props} />
    );
  }
}

export default TweenShape;

