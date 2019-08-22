import React, { Fragment } from 'react';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear } from '@vx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { Grid } from '@vx/grid';
import { LinePath, Bar } from '@vx/shape';
import range from 'lodash/range'
import map from 'lodash/map'

import { Animate } from 'react-move'

import FontSizeContext from 'components/ThemeProvider/FontSizeContext'
import theme from 'components/ThemeProvider/theme'

import ChartBase from 'components/Charts/ChartBase'

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
            })
            const percentYScale = scaleLinear({
              range: [yHeight, 0],
              domain: [0, 1.3],
            });
            const valueYScale = scaleLinear({
              range: [yHeight, 0],
              domain: [0, Math.ceil(Math.max(...formattedData.map(yValue)) / 100) * 100],
            });
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
                    strokeWidth="1.5"
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
                    strokeWidth="1.5"
                    tickStroke="none"
                    tickFormat={d => `${d}月`}
                    tickLabelProps={() => ({
                      fill: 'white',
                      fontSize: em * 0.8,
                    })}
                  />
                  <Group left={xStart}>
                    <LinePath
                      data={formattedData}
                      x={dd => xScale(xValue(dd))}
                      y={dd => valueYScale(yValue(dd))}
                      stroke={theme.colors.lightOrange}
                      strokeWidth="1.5"
                    />
                    {formattedData.map(d => {
                      const xPos = xScale(d.month)
                      const barHeight = yHeight - percentYScale(d.receivedRate)
                      const barY = yHeight - barHeight
                      const dotY = valueYScale(yValue(d))
                      return (
                        <Fragment>
                          <circle
                            cx={xPos}
                            cy={dotY}
                            r={em / 3}
                            fill={theme.colors.darkOrange}
                          />
                          <text
                            x={xPos}
                            y={dotY - em}
                            textAnchor="middle"
                            fontSize={em}
                            fill={theme.colors.lightOrange}
                          >
                            {yValue(d)}
                          </text>
                          <Bar
                            key={`bar-${d.month}`}
                            x={xPos - 1.5 * em}
                            y={barY}
                            width={2 * em}
                            height={barHeight}
                            fill={theme.colors.lightOrange}
                            opacity={0.3}
                          />
                        </Fragment>
                      )
                    })}
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
