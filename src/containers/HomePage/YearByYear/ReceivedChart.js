import React, { Fragment } from 'react';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear } from '@vx/scale';
import range from 'lodash/range'
import { NodeGroup } from 'react-move'
import { format } from 'd3-format'
import { max } from 'd3-array'

import FontSizeContext from '../../../components/ThemeProvider/FontSizeContext'

import ChartBase from '../../../components/Charts/ChartBase'

const xValue = d => d.index
const yValue = d => d.receivedRate
const pd = format('.2%')

const ReceivedChart = ({
  data,
  getFill,
  xTickFormat,
  ...props
}) => {
  return (
    <FontSizeContext.Consumer>
      {({ em }) => (
        <ChartBase {...props}>
          {({ width, height }) => {
            const yStart = 6 * em
            const yEnd = height - 2 * em
            const yHeight = yEnd - yStart

            const xStart = em * 3
            const xEnd = width - em
            const xScale = scaleBand({
              range: [0, xEnd - xStart],
              domain: range(0, data.length),
              paddingInner: 0.2,
            })
            const yScale = scaleLinear({
              range: [0, yHeight],
              domain: [0, Math.ceil(max(data, yValue))],
            });
            return (
              <Group>
                <Group top={yStart} left={xStart}>
                  <NodeGroup
                    data={data}
                    keyAccessor={xValue}
                    start={d => ({
                      xPos: xScale(xValue(d)),
                      y: 0,
                    })}
                    enter={d => ({
                      y: [yScale(yValue(d))],
                      timing: { duration: 500 },
                    })}
                    update={d => ({
                      xPos: [xScale(xValue(d))],
                      y: [yScale(yValue(d))],
                      timing: { duration: 500 },
                    })}
                  >
                    {nodes => (
                      <Fragment>
                        {nodes.map(({ key, data: d, state: { xPos, y } }) => {
                          const barWidth = xScale.bandwidth()
                          return (
                            <g key={key}>
                              <rect
                                fill="#e2e2e3"
                                x={xPos}
                                y={0}
                                width={barWidth}
                                height={yHeight}
                              />
                              <rect
                                fill={getFill(d.index)}
                                x={xPos}
                                y={yHeight - y}
                                width={barWidth}
                                height={y}
                              />
                              <text
                                fontSize={em}
                                x={xPos + barWidth / 2}
                                y={yHeight - y - em}
                                textAnchor="middle"
                              >
                                {pd(yValue(d))}
                              </text>
                              <text
                                fontSize={0.8 * em}
                                x={xPos + barWidth / 2}
                                y={yHeight + 1.5 * em}
                                textAnchor="middle"
                              >
                                {xTickFormat(xValue(d))}
                              </text>
                            </g>
                          )
                        })}
                      </Fragment>
                    )}
                  </NodeGroup>
                </Group>
              </Group>
            )
          }}
        </ChartBase>
      )}
    </FontSizeContext.Consumer>
  );
};

export default ReceivedChart;
