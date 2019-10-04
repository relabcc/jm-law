import React, { Fragment, PureComponent, createElement } from 'react';
import { Group } from '@vx/group';
import { scaleLinear } from '@vx/scale';
import { LinearGradient } from '@vx/gradient';
import { RectClipPath } from '@vx/clip-path'
import { Animate } from 'react-move'
import sortBy from 'lodash/sortBy'
import shortid from 'shortid';

import FontSizeContext from '../../components/ThemeProvider/FontSizeContext'
// import theme from '../../components/ThemeProvider/theme'

import ChartBase from '../../components/Charts/ChartBase'
import LineBreakText from '../../components/Charts/LineBreakText'
import withLawData from '../../services/api/withLawData'

const labelLength = 18

class LawTops extends PureComponent {
  constructor(props) {
    super(props);
    this.SIG = shortid.generate()
  }

  componentDidUpdate(prevProps) {
    const { year, updateParams, top } = this.props
    if (prevProps.year !== year) {
      updateParams({ year, top })
    }
  }

  render() {
    const { hasLine, color, ratio, top, data, publicOnly } = this.props;
    let sorted = sortBy(data, 'count').reverse()
    if (publicOnly) sorted = sorted.filter(d => d.isPublic)
    sorted = sorted.slice(0, top)
    return (
      <FontSizeContext.Consumer>
        {({ em }) => (
          <ChartBase ratio={ratio}>
            {({ width }) => {
              const yStart = em * 2.5
              const xStart = labelLength * em * 1.1;
              const xEnd = width - 3 * em - xStart
              const xScale = scaleLinear({
                range: [0, xEnd],
                domain: [0, Math.max(...sorted.map(d => d.count))],
              });
              return (
                <Fragment>
                  <LinearGradient from="#ffab2a" to="#ff712a" vertical={false} id={`bar-ramp-${this.SIG}`} />
                  <Group top={yStart}>
                    {sorted.map((law, i) => {
                      return (
                        <Animate
                          start={{ width: 0 }}
                          enter={{
                            width: [xScale(law.count)],
                            timing: { duration: 200 },
                          }}
                          update={{
                            width: [xScale(law.count)],
                            timing: { duration: 200 },
                          }}
                          key={law.id}
                        >
                          {(state) => (
                            <Group top={i * em * 3}>
                              <LineBreakText
                                fill={color}
                                fontSize={em}
                                maxLength={labelLength}
                                fillFront
                                textAnchor="end"
                                x={xStart - em}
                                y={0.5 * em}
                                title={law.name}
                              >
                                {law.name.length > labelLength * 2 ? law.name.substring(0, labelLength * 2 - 3).concat('...') : law.name}
                              </LineBreakText>
                              <RectClipPath
                                id={`bar-${this.SIG}-${i}`}
                                x={xStart}
                                y="-0.5em"
                                width={state.width}
                                height={1.25 * em}
                              />
                              <rect
                                fill={`url(#bar-ramp-${this.SIG})`}
                                clipPath={`url(#bar-${this.SIG}-${i})`}
                                x={xStart}
                                y="-0.5em"
                                width={xEnd}
                                height={1.25 * em}
                              />
                              <text
                                fill={color}
                                x={xStart + state.width + em * 0.5}
                                y="0.5em"
                              >{law.count}</text>
                            </Group>
                          )}
                        </Animate>
                      )
                    })}
                  </Group>
                  {hasLine && (
                    <line
                      x1={xStart}
                      x2={xStart}
                      y1={yStart / 2}
                      y2={yStart / 2 + sorted.length * em * 3}
                      stroke={color}
                      strokeWidth="1.5"
                    />
                  )}
                </Fragment>
              )
            }}
          </ChartBase>
        )}
      </FontSizeContext.Consumer>
    );
  }
}

export default ({ publicOnly, ...props }) => createElement(withLawData({ top: props.top, year: props.year, publicOnly }, props.lockId)(LawTops), props);
