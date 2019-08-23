import React, { Fragment, PureComponent, createElement } from 'react';
import { Group } from '@vx/group';
import { scaleLinear } from '@vx/scale';
import { Animate } from 'react-move'
import sortBy from 'lodash/sortBy'

import FontSizeContext from 'components/ThemeProvider/FontSizeContext'
import theme from 'components/ThemeProvider/theme'

import ChartBase from 'components/Charts/ChartBase'
import LineBreakText from 'components/Charts/LineBreakText'
import withData from 'services/api/withData'

const labelLength = 15

class LawTops extends PureComponent {
  componentDidUpdate(prevProps) {
    const { year, updateParams, top } = this.props
    if (prevProps.year !== year) {
      updateParams({ year, top })
    }
  }

  render() {
    const { hasLine, color, ratio, top } = this.props;
    const data = this.props['data/bureaus/laws']
    const sorted = sortBy(data, 'count').slice(0, top)
    return (
      <FontSizeContext.Consumer>
        {({ em }) => (
          <ChartBase ratio={ratio}>
            {({ width }) => {
              const yStart = em * 2.5
              const xStart = labelLength * em * 1.1;
              const xScale = scaleLinear({
                range: [0, width - 3 * em - xStart],
                domain: [0, Math.max(...sorted.map(d => d.count))],
              });
              return (
                <Fragment>
                  <Group top={yStart}>
                    {Array.from(sorted).reverse().map((law, i) => {
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
                            <Group top={i * em * 2.75}>
                              <LineBreakText
                                fill={color}
                                fontSize={em}
                                maxLength={labelLength}
                                fillFront
                              >
                                {law.name}
                              </LineBreakText>
                              <rect
                                fill={theme.colors.primary}
                                x={xStart}
                                y="-0.5em"
                                width={state.width}
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
                      y2={yStart / 2 + sorted.length * em * 2.75}
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

export default props => createElement(withData('data/bureaus/laws', { top: props.top, year: props.year })(LawTops), props);
