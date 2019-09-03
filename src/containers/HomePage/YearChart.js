import React, { Fragment } from 'react';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear } from '@vx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { Grid } from '@vx/grid';
import { LinePath, Bar } from '@vx/shape';
import range from 'lodash/range'
import map from 'lodash/map'
import { NodeGroup } from 'react-move'

import FontSizeContext from '../../components/ThemeProvider/FontSizeContext'
import theme from '../../components/ThemeProvider/theme'

import ChartBase from '../../components/Charts/ChartBase'
import TweenShape from '../../components/Charts/TweenShape'

const xValue = d => d.month
const yValue = d => d.issued

const YearChart = ({
  data,
  ...props
}) => {
  const formattedData = map(data, (d, month) => ({
    month,
    ...d,
    receivedRate: d.received / d.issued,
  }))

  return (
    <FontSizeContext.Consumer>
      {({ em }) => (
        <ChartBase {...props}>
          {({ width, height }) => {
            const yStart = 2 * em
            const yEnd = height - 2 * em
            const yHeight = yEnd - yStart
            const xStart = em * 3
            const xEnd = width - em * 13
            const xScale = scaleBand({
              range: [0, xEnd - xStart],
              domain: range(1, 13),
              paddingInner: 0.3,
              paddingOuter: 0.3,
            })
            const percentYScale = scaleLinear({
              range: [yHeight, 0],
              domain: [0, 1.3],
            });
            const valueYScale = scaleLinear({
              range: [yHeight, 0],
              domain: [0, Math.ceil(Math.max(...formattedData.map(yValue)) / 100) * 100],
            });
            const barWidth = xScale.bandwidth()
            return (
              <Group top={yStart}>
                <Group left={xStart}>
                  <Grid
                    top={0}
                    left={0}
                    xScale={xScale}
                    yScale={percentYScale}
                    stroke="white"
                    width={xEnd - xStart}
                    height={yHeight}
                    numTicksRows={3}
                    numTicksColumns={0}
                    columnLineStyle={{
                      strokeWidth: 0,
                    }}
                  />
                  <AxisLeft
                    top={0}
                    left={0}
                    scale={percentYScale}
                    numTicks={3}
                    stroke="white"
                    strokeWidth={1.5}
                    tickStroke="none"
                    tickLabelProps={() => ({
                      fill: 'white',
                      textAnchor: 'end',
                      fontSize: em * 0.8,
                      dx: '-0.25em',
                      dy: '0.25em'
                    })}
                    tickFormat={d => Math.round(d * 100)}
                  />
                  <AxisBottom
                    top={yHeight}
                    left={0}
                    scale={xScale}
                    numTicks={12}
                    stroke="white"
                    strokeWidth={1.5}
                    tickStroke="none"
                    tickFormat={d => `${d}月`}
                    tickLabelProps={() => ({
                      fill: 'white',
                      fontSize: em * 0.8,
                      textAnchor: 'middle',
                    })}
                  />
                  <Group left={xStart}>
                    <LinePath
                      x={dd => xScale(xValue(dd)) - barWidth / 2}
                      y={dd => valueYScale(yValue(dd))}
                    >
                      {({ path }) => (
                        <TweenShape
                          d={path(formattedData)}
                          stroke={theme.colors.lightOrange}
                          strokeWidth="1.5"
                          fill="transparent"
                          duration={500}
                        />
                      )}
                    </LinePath>
                    <NodeGroup
                      data={formattedData}
                      keyAccessor={xValue}
                      start={d => ({
                        xPos: xScale(xValue(d)),
                        barHeight: 0,
                        dotY: yHeight,
                      })}
                      enter={d => ({
                        barHeight: [yHeight - percentYScale(d.receivedRate)],
                        dotY: [valueYScale(yValue(d))],
                        timing: { duration: 500 },
                      })}
                      update={d => ({
                        xPos: [xScale(xValue(d))],
                        barHeight: [yHeight - percentYScale(d.receivedRate)],
                        dotY: [valueYScale(yValue(d))],
                        timing: { duration: 500 },
                      })}
                    >
                      {nodes => (
                        <Fragment>
                          {nodes.map(({ key, data: d, state: { xPos, barHeight, dotY } }) => {
                            const barY = yHeight - barHeight;
                            const dotX = xPos - barWidth / 2
                            return (
                              <Fragment key={key}>
                                <Bar
                                  x={xPos - barWidth}
                                  y={barY}
                                  width={barWidth}
                                  height={barHeight}
                                  fill={theme.colors.lightOrange}
                                  opacity={0.3}
                                />
                                <circle
                                  cx={dotX}
                                  cy={dotY}
                                  r={em / 3}
                                  fill={theme.colors.spectrum[3]}
                                />
                                <text
                                  x={dotX}
                                  y={dotY - em}
                                  textAnchor="middle"
                                  fontSize={em}
                                  fill={theme.colors.lightOrange}
                                >
                                  {yValue(d)}
                                </text>
                              </Fragment>
                            )
                          })}
                        </Fragment>
                      )}
                    </NodeGroup>
                  </Group>
                </Group>
                <Group top={yHeight / 2 - em} left={xEnd + 5 * em}>
                  <Group>
                    <text>案件量</text>
                    <line
                      x1={4 * em}
                      y1={-0.5 * em}
                      x2={7 * em}
                      y2={-0.5 * em}
                      stroke={theme.colors.lightOrange}
                      strokeWidth="1.5"
                    />
                  </Group>
                  <Group top={2.5 * em}>
                    <text>收繳率</text>
                    <rect
                      x={4 * em}
                      y={-1 * em}
                      width={3 * em}
                      height={em}
                      fill={theme.colors.lightOrange}
                      opacity={0.3}
                    />
                  </Group>
                </Group>
              </Group>
            )
          }}
        </ChartBase>
      )}
    </FontSizeContext.Consumer>
  );
};

export default YearChart;
