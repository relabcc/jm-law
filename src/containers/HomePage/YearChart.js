import React, { Fragment } from 'react';
import { Group } from '@vx/group';
import { scaleBand, scaleLinear } from '@vx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { Grid } from '@vx/grid';
import { LinePath, Bar } from '@vx/shape';
import { LinearGradient } from '@vx/gradient';
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

  return (
    <FontSizeContext.Consumer>
      {({ em }) => (
        <ChartBase {...props}>
          {({ width, height }) => {
            const formattedData = map(data, (d, month) => ({
              month,
              ...d,
              receivedRate: d.issuedDollar ? d.receivedDollar / d.issuedDollar : 0,
              width,
            }))
            const yStart = 2 * em
            const yEnd = height - 2 * em
            const yHeight = yEnd - yStart
            const xStart = em * 3
            const xEnd = width - em * 3
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
            const valueYMax = Math.ceil(Math.max(...formattedData.map(yValue)) / 100) * 100
            const valueYScale = valueYMax ? scaleLinear({
              range: [yHeight, 0],
              domain: [0, valueYMax],
            }) : () => yHeight;
            const barWidth = xScale.bandwidth()
            return (
              <Fragment>
                <LinearGradient from="#85DADF" to="#C9ECF0" vertical id="bar" />
                <Group top={yStart}>
                  <Group left={xStart}>
                    <Grid
                      top={0}
                      left={0}
                      xScale={xScale}
                      yScale={percentYScale}
                      stroke={theme.colors.lightGray}
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
                      stroke={theme.colors.darkGray}
                      strokeWidth={1.5}
                      tickStroke="none"
                      tickLabelProps={() => ({
                        fill: theme.colors.darkGray,
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
                      stroke={theme.colors.darkGray}
                      strokeWidth={1.5}
                      tickStroke="none"
                      tickFormat={d => `${d}月`}
                      tickLabelProps={() => ({
                        fill: theme.colors.darkGray,
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
                            stroke={theme.colors.teal}
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
                          barHeight: [yHeight - (percentYScale(d.receivedRate) || yHeight)],
                          dotY: [valueYScale(yValue(d))],
                          timing: { duration: 500 },
                        })}
                        update={d => ({
                          xPos: [xScale(xValue(d))],
                          barHeight: [yHeight - (percentYScale(d.receivedRate) || yHeight)],
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
                                    fill="url('#bar')"
                                  />
                                  <circle
                                    cx={dotX}
                                    cy={dotY}
                                    r={em / 5}
                                    fill={theme.colors.teal}
                                  />
                                  <text
                                    x={dotX}
                                    y={dotY - em}
                                    textAnchor="middle"
                                    fontSize={em}
                                    fill={theme.colors.darkGray}
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
                </Group>

              </Fragment>
            )
          }}
        </ChartBase>
      )}
    </FontSizeContext.Consumer>
  );
};

export default YearChart;
