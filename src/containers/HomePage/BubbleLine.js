import React, { Fragment } from 'react';
import { NodeGroup } from 'react-move'
import loSortBy from 'lodash/sortBy'
import { max } from 'd3-array'
import { Circle } from '@vx/shape';
import { scaleLinear, scalePower } from '@vx/scale';
import { LinearGradient } from '@vx/gradient';

import ChartBase from 'components/Charts/ChartBase'
import theme from 'components/ThemeProvider/theme'

const emPercent = n => (
  <Fragment>
    {Math.round(n * 100)}
    <tspan fontSize="0.7em">%</tspan>
  </Fragment>
)

const BubbleLine = ({ data, sortBy, sortOrder, ...props }) => {
  if (!data || !data.length) return null
  // console.log(data)
  return (
    <ChartBase {...props}>
      {({ width, height }) => {
        const em = Math.floor(width / 70)
        const rMax = height / 4
        const labelWidth = width / 10
        const xStart = labelWidth + rMax
        const xEnd = width - rMax
        const lableY = height / 2 + height / 20
        const rateY = height / 2 + height / 20 + height * 0.15
        const dollarRateY = height / 2 + height / 20 + height * 0.15 * 2

        const xScale = scaleLinear({
          domain: [0, data.length - 1],
          range: [xStart, xEnd]
        })

        const rScale = scalePower({
          domain: [0, max(data, d => d.issued)],
          range: [0, rMax],
          exponent: 2,
        });
        return (
          <Fragment>
            <LinearGradient from="#383a58" to="#221836" vertical={false} id="dark" />
            <LinearGradient from={theme.colors.darkRed} to={theme.colors.lightOrange} vertical={false} id="rate" />
            <g>
              <rect
                width={labelWidth}
                height={height}
                x={0}
                y={0}
                opacity={0.15}
                fill="url('#dark')"
                rx={em}
              />
              <text
                x={labelWidth / 2}
                y={rMax - em / 2}
                textAnchor="middle"
                fontSize={em}
              >
                已開
              </text>
              <text
                x={labelWidth / 2}
                y={rMax + em * 0.8}
                textAnchor="middle"
                fontSize={em}
              >
                案件量
              </text>
              <text
                x={labelWidth / 2}
                y={rateY + em / 3}
                textAnchor="middle"
                fontSize={em}
              >
                收繳率
              </text>
              <text
                x={labelWidth / 2}
                y={dollarRateY + em / 3}
                textAnchor="middle"
                fontSize={em}
              >
                執行率
              </text>
              <text
                x={labelWidth / 2}
                y={lableY + em / 3}
                textAnchor="middle"
                fontSize={em}
              >
                局處
              </text>
            </g>
            <line
              x1={xStart}
              y1={rMax}
              x2={xEnd}
              y2={rMax}
              stroke={theme.colors.lightGray}
              strokeWidth="2"
            />
            <rect
              width={xEnd - xStart + rMax}
              height={2 * em}
              fill="url('#rate')"
              x={xStart - rMax / 2}
              y={rateY - em}
              rx={em}
            />
            <rect
              width={xEnd - xStart + rMax}
              height={2 * em}
              fill="url('#rate')"
              x={xStart - rMax / 2}
              y={dollarRateY - em}
              rx={em}
            />
            <NodeGroup
              // must make react-move think data had been updated, so we inject width and height here
              data={loSortBy(data.map(d => ({ ...d, width, height })), sortBy)}
              keyAccessor={d => d.label}
              start={(d, i) => ({
                cx: xScale(i),
                r: 0,
                opacity: 0.5,
              })}
              enter={d => ({
                r: [rScale(d.issued)],
                timing: { duration: 500 },
              })}
              update={(d, i) => ({
                cx: [xScale(i)],
                r: [rScale(d.issued)],
                timing: { duration: 500 },
              })}
              leave={() => ({
                opacity: [0],
                timing: { duration: 500 },
              })}
            >
              {nodes => (
                <g>
                  {nodes.map(({ key, data: d, state: { cx, r, opacity } }) => {
                    return (
                      <g key={key}>
                        <Circle
                          cx={cx}
                          cy={rMax}
                          r={r}
                          fill={theme.colors.primary}
                          opacity={opacity}
                        />
                        <text
                          x={cx}
                          y={lableY + em / 3}
                          textAnchor="middle"
                          fontSize={em}
                        >
                          {d.label}
                        </text>
                        <text
                          x={cx}
                          y={rateY + em / 3}
                          textAnchor="middle"
                          fontWeight="bold"
                          fontSize={em}
                          fill="white"
                        >
                          {emPercent(d.receiveRate)}
                        </text>
                        <text
                          x={cx}
                          y={dollarRateY + em / 3}
                          textAnchor="middle"
                          fontWeight="bold"
                          fontSize={em}
                          fill="white"
                        >
                          {emPercent(d.receiveDollarRate)}
                        </text>
                      </g>
                    );
                  })}
                  {nodes.map(({ key, state: { cx } }) => {
                    return (
                      <g key={key}>
                        <Circle
                          cx={cx}
                          cy={rMax}
                          r={rMax / 25}
                          fill={theme.colors.darkGray}
                        />
                      </g>
                    );
                  })}
                </g>
              )}
            </NodeGroup>
          </Fragment>
        );
      }}
    </ChartBase>
  )
}

export default BubbleLine;
