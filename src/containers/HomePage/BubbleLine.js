import React, { Fragment } from 'react';
import { NodeGroup } from 'react-move'
import loSortBy from 'lodash/sortBy'
import { max } from 'd3-array'
import { Circle } from '@vx/shape';
import { scaleLinear, scalePower } from '@vx/scale';
import { LinearGradient } from '@vx/gradient';

import ChartBase from 'components/Charts/ChartBase'
import LineBreakText from 'components/Charts/LineBreakText'
import theme from 'components/ThemeProvider/theme'

import InfoSection from './InfoSection'

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
        const em = Math.floor(width / 90)
        const rLabelHeight = 2 * em
        const rMax = height * 0.22
        const leftLabelWidth = width * 0.075
        const rightInfoWidth = width * 0.18
        const xStart = leftLabelWidth + rMax
        const xEnd = width - rMax - rightInfoWidth
        const lableY = rLabelHeight + rMax * 2 + em * 4
        const rateY = lableY + em * 3
        const dollarRateY = rateY + em * 2.5

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
            <LinearGradient from={theme.colors.darkBlue} to={theme.colors.darkerBlue} vertical={false} id="dark" />
            <LinearGradient from={theme.colors.darkRed} to={theme.colors.lightOrange} vertical={false} id="rate" />
            <g>
              <rect
                width={leftLabelWidth}
                height={height - rLabelHeight / 2}
                x={0}
                y={rLabelHeight / 2}
                opacity={0.15}
                fill="url('#dark')"
                rx={em}
              />
              {[lableY, rateY - 2 * em / 3, dollarRateY - 2 * em / 3].map((y, i) => (
                <line
                  key={i}
                  x1={em}
                  x2={leftLabelWidth - em}
                  y1={y - em *2 / 3}
                  y2={y - em *2 / 3}
                  stroke={theme.colors.text}
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              ))}
              {[
                { label: '已開案件量', y: rLabelHeight + rMax - em / 2 },
                { label: '局處', y: lableY + em },
                { label: '收繳率', y: rateY + em / 3 },
                { label: '執行率', y: dollarRateY + em / 3 },
              ].map(({ label, y }, i) => (
                <LineBreakText
                  key={i}
                  x={leftLabelWidth / 2}
                  y={y}
                  textAnchor="middle"
                  fontSize={1.25 * em}
                  fontWeight="bold"
                  maxLength={3}
                  letterSpacing="2"
                >
                  {label}
                </LineBreakText>
              ))}
            </g>
            <line
              x1={xStart}
              y1={rLabelHeight + rMax}
              x2={width}
              y2={rLabelHeight + rMax}
              stroke={theme.colors.lightGray}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect
              width={xEnd - xStart + rMax}
              height={2 * em}
              fill="url('#rate')"
              x={xStart - rMax / 2}
              y={rateY - em}
              rx={em}
            />
            {/* <rect
              width={xEnd - xStart + rMax}
              height={2 * em}
              fill="url('#rate')"
              x={xStart - rMax / 2}
              y={dollarRateY - em}
              rx={em}
            /> */}
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
                          cy={rLabelHeight + rMax}
                          r={r}
                          fill={theme.colors.lightOrange}
                          opacity={opacity}
                        />
                        <text
                          fill={theme.colors.darkGray}
                          x={cx}
                          y={rLabelHeight + rMax - r - 0.5 * em}
                          textAnchor="middle"
                          fontSize={em}
                        >
                          {d.issued}
                        </text>
                        <line
                          x1={cx}
                          x2={cx}
                          y1={rLabelHeight + rMax}
                          y2={lableY + em}
                          stroke={theme.colors.lightGray}
                        />
                        <LineBreakText
                          x={cx}
                          y={lableY + em}
                          textAnchor="middle"
                          fontSize={em}
                          maxLength={3}
                          lineBefore
                          em={em}
                          bg="white"
                        >
                          {d.label}
                        </LineBreakText>
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
                          cy={rMax + rLabelHeight}
                          r={rMax / 25}
                          fill={theme.colors.darkGray}
                        />
                      </g>
                    );
                  })}
                </g>
              )}
            </NodeGroup>
            <InfoSection
              xEnd={width}
              y={rLabelHeight + 2 * em}
              em={em}
              main={{
                value: data.reduce((sum, d) => sum + d.issued, 0),
                label: '已開案量',
                unit: '件',
              }}
              sub={{
                value: data.reduce((sum, d) => sum + d.issuedDollar, 0),
                label: '案件金額',
                unit: '元',
              }}
            />
            <InfoSection
              xEnd={width}
              y={rLabelHeight + 9.5 * em}
              em={em}
              main={{
                value: data.reduce((sum, d) => sum + d.received, 0),
                label: '收繳案件',
                unit: '件',
              }}
              sub={{
                value: data.reduce((sum, d) => sum + d.receivedDollar, 0),
                label: '收繳金額',
                unit: '元',
              }}
            />
            <InfoSection
              xEnd={width}
              y={rLabelHeight + 18 * em}
              em={em}
              main={{
                value: data.reduce((sum, d) => sum + d.canceled, 0),
                label: '撤銷案件量',
                unit: '件',
              }}
            />
          </Fragment>
        );
      }}
    </ChartBase>
  )
}

export default BubbleLine;
