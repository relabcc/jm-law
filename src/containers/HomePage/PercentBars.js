import React, { Fragment } from 'react';
import { Group } from '@vx/group';
import { scaleLinear } from '@vx/scale';
import { Animate } from 'react-move'
import { format } from 'd3-format'

import FontSizeContext from 'components/ThemeProvider/FontSizeContext'

import ChartBase from 'components/Charts/ChartBase'

const pd = format('.0%')

const PercentBars = ({
  data,
  legends,
  onLegendClick,
  activeLegend,
  ...props
}) => {
  const dataByKey = data.reduce((dk, d) => {
    dk[d.name] = d.received / d.issued;
    return dk
  }, {})
  const legendsLength = Math.max(...legends.map(l => l.label.length))
  return (
    <FontSizeContext.Consumer>
      {({ em }) => (
        <ChartBase {...props}>
          {({ width }) => {
            const yStart = 6 * em
            const xScale = scaleLinear({
              range: [0, width - 3 * em - legendsLength * em * 1.25],
              domain: [0, 1],
            });
            return (
              <Group top={yStart}>
                {legends.map(({ label, color }, i) => {
                  const handleClick = () => onLegendClick(label === activeLegend ? null : label)
                  return (
                    <Group
                      top={i * em * 2.5}
                      opacity={!activeLegend || activeLegend === label ? 1 : 0.3}
                      key={label + i}
                    >
                      <text
                        fill="white"
                        fontSize={em}
                        onClick={handleClick}
                        style={{ cursor: 'pointer' }}
                      >
                        {label}
                      </text>
                      <rect
                        x={legendsLength * em * 1.25}
                        y={-1.25 * em}
                        width={xScale(1)}
                        height={1.5 * em}
                        fill="white"
                        opacity="0.15"
                      />
                      <Animate
                        start={{ width: 0 }}
                        enter={{
                          width: [xScale(dataByKey[label])],
                          timing: { duration: 500 },
                        }}
                        update={{
                          width: [xScale(dataByKey[label])],
                          timing: { duration: 500 },
                        }}
                      >
                        {(state) => (
                          <Fragment>
                            <rect
                              x={legendsLength * em * 1.25}
                              y={-1.25 * em}
                              height={1.5 * em}
                              {...state}
                              fill={color}
                              onClick={handleClick}
                            />
                            <text
                              x={legendsLength * em * 1.25 + state.width + 0.5 * em}
                              y="-.3em"
                              fill="white"
                              fontSize={em * 0.8}
                            >
                              {pd(dataByKey[label])}
                            </text>
                          </Fragment>
                        )}
                      </Animate>
                    </Group>
                  )
                })}
              </Group>
            )
          }}
        </ChartBase>
      )}
    </FontSizeContext.Consumer>
  );
};

export default PercentBars;
