import React, { Fragment, PureComponent, createRef } from 'react'
import { createPortal } from 'react-dom'
import { Animate, NodeGroup } from 'react-move'
import loSortBy from 'lodash/sortBy'
import { max } from 'd3-array'
import { Bar, Circle } from '@vx/shape';
import { scaleLinear, scalePower } from '@vx/scale';
import { LinearGradient, RadialGradient } from '@vx/gradient';
import { localPoint } from '@vx/event';
import { Group } from '@vx/group';
import { HoverSensor } from 'libreact/lib/HoverSensor';

import ChartBase from 'components/Charts/ChartBase'
import LineBreakText from 'components/Charts/LineBreakText'
import theme from 'components/ThemeProvider/theme'
import FontSizeContext from 'components/ThemeProvider/FontSizeContext'

import InfoSection from './InfoSection'

const emPercent = n => (
  <Fragment>
    {Math.round(n * 100)}
    <tspan fontSize="0.7em">%</tspan>
  </Fragment>
)

const canGoDown = typeof window !== 'undefined' && window.__ID === '00000000'

class BubbleLine extends PureComponent {
  static getDerivedStateFromProps({ data }) {
    return {
      namedData: data.reduce((nd, d) => {
        nd[d.id] = d
        return nd
      }, {})
    }
  }

  state = {}

  wrapper = createRef()

  handleTooltip = ({ event, xScale, data }) => {
    const { x } = localPoint(event);
    const index = Math.round(xScale.invert(x))
    const d = data[index]
    if (d) {
      this.setState({ activeId: d.id })
    } else {
      this.setState({ activeId: null })
    }
  }

  handleClick = () => {
    const { activeId } = this.state
    const { lockId, onLock } = this.props
    if (lockId) {
      this.setState({ activeId: null }, () => onLock(null))
    } else {
      onLock(activeId)
    }
  }

  render() {
    const {
      data,
      sortBy,
      sortOrder,
      onLock,
      lockId,
      ...props
    } = this.props
    const { activeId, namedData } = this.state;
    if (!data || !data.length) return null
    const sortedData = loSortBy(data, sortBy)
    return (
      <FontSizeContext.Consumer>
        {({ em }) => (
          <ChartBase {...props}>
            {({ width, height }) => {
              const rLabelHeight = 2 * em
              const rMax = height * 0.22
              const leftLabelWidth = width * 0.075
              const rightInfoWidth = width * 0.18
              const xStart = leftLabelWidth + rMax
              const xEnd = width - rMax - rightInfoWidth
              const lableY = rLabelHeight + rMax * 2 + em * 3.5
              const rateY = lableY + em * 3
              const dollarRateY = rateY + em * 2.5

              const xScale = scaleLinear({
                domain: [0, data.length - 1],
                range: [xStart, xEnd]
              })

              const rScale = scalePower({
                domain: [0, max(data, d => d.issued)],
                range: [0, rMax],
                exponent: 0.5,
              });

              return (
                <Fragment>
                  <LinearGradient from={theme.colors.darkBlue} to={theme.colors.darkerBlue} vertical={false} id="dark" />
                  <LinearGradient from={theme.colors.orange6} to={theme.colors.orange2} vertical={false} id="rate" />
                  <RadialGradient from={theme.colors.orange4} to={theme.colors.orange4} toOpacity={0} id="radial-trans" />
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
                        y1={y - em * 2 / 3}
                        y2={y - em * 2 / 3}
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
                  <Animate
                    start={{
                      opacity: 1,
                    }}
                    update={{
                      opacity: [(activeId || lockId) ? 0.1 : 1],
                      timing: { duration: 250 }
                    }}
                  >
                    {state => (
                      <line
                        x1={xStart}
                        y1={rLabelHeight + rMax}
                        x2={width}
                        y2={rLabelHeight + rMax}
                        stroke={theme.colors.lightGray}
                        strokeWidth="2"
                        strokeLinecap="round"
                        {...state}
                      />
                    )}
                  </Animate>
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
                  <Bar
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill="transparent"
                    data={data}
                    onTouchStart={event =>
                      this.handleTooltip({
                        event,
                        xScale,
                        data: sortedData,
                      })
                    }
                    onTouchMove={event =>
                      this.handleTooltip({
                        event,
                        xScale,
                        data: sortedData,
                      })
                    }
                    onMouseMove={event =>
                      this.handleTooltip({
                        event,
                        xScale,
                        data: sortedData,
                      })
                    }
                    onMouseLeave={() => this.setState({ activeId: null })}
                    onClick={this.handleClick}
                  />
                  <g ref={this.wrapper}>
                    <NodeGroup
                      // must make react-move think data had been updated, so we inject width and height here
                      data={sortedData.map(d => ({ ...d, width, height }))}
                      keyAccessor={d => d.label}
                      start={(d, i) => ({
                        cx: xScale(i),
                        r: 0,
                        opacity: 0.5,
                        otherOpacity: 1,
                        centerR: 0,
                      })}
                      enter={d => ({
                        r: [rScale(d.issued)],
                        timing: { duration: 500 },
                      })}
                      update={(d, i) => {
                        let active = true
                        let centerActive
                        if (lockId) {
                          active = lockId === d.id
                          centerActive = lockId === d.id
                        } else if (activeId) {
                          active = activeId === d.id
                        }
                        return [
                          {
                            cx: [xScale(i)],
                            r: [rScale(d.issued)],
                            timing: { duration: 500 },
                          },
                          {
                            opacity: [active ? 0.5 : 0.1],
                            otherOpacity: [active ? 1 : 0.1],
                            centerR: [centerActive ? em : 0],
                            timing: { duration: 250 },
                          },
                        ]
                      }}
                      leave={() => ({
                        opacity: [0],
                        timing: { duration: 500 },
                      })}
                    >
                      {nodes => (
                        <g>
                          {nodes.map(({ key, data: d, state: { cx, r, opacity, otherOpacity } }) => {
                            return (
                              <g key={key}>
                                <Circle
                                  cx={cx}
                                  cy={rLabelHeight + rMax}
                                  r={r}
                                  fill={theme.colors.orange2}
                                  opacity={opacity}
                                  style={{ pointerEvents: 'none' }}
                                />
                                <text
                                  fill={theme.colors.darkGray}
                                  x={cx}
                                  y={rLabelHeight + rMax - r - 0.5 * em}
                                  textAnchor="middle"
                                  fontSize={em}
                                  opacity={otherOpacity}
                                  style={{ pointerEvents: 'none' }}
                                >
                                  {d.issued}
                                </text>
                                <line
                                  x1={cx}
                                  x2={cx}
                                  y1={rLabelHeight + rMax}
                                  y2={lableY + em}
                                  stroke={theme.colors.lightGray}
                                  opacity={otherOpacity}
                                  style={{ pointerEvents: 'none' }}
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
                                  opacity={otherOpacity}
                                  style={{ pointerEvents: 'none' }}
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
                                  opacity={otherOpacity}
                                  style={{ pointerEvents: 'none' }}
                                >
                                  {emPercent(d.receiveRate)}
                                </text>
                                <text
                                  x={cx}
                                  y={dollarRateY + em / 3}
                                  textAnchor="middle"
                                  fontWeight="bold"
                                  fontSize={em}
                                  opacity={otherOpacity}
                                  style={{ pointerEvents: 'none' }}
                                >
                                  {emPercent(d.receiveDollarRate)}
                                </text>
                              </g>
                            );
                          })}
                          {nodes.map(({ key, data: d, state: { cx, otherOpacity, centerR } }) => {
                            return (
                              <g key={key}>
                                <Circle
                                  cx={cx}
                                  cy={rMax + rLabelHeight}
                                  r={rMax / 25}
                                  fill={theme.colors.darkGray}
                                  opacity={otherOpacity}
                                  style={{ pointerEvents: 'none' }}
                                />
                                <HoverSensor>
                                  {({ isHover }) => {
                                    const cy = rLabelHeight + rMax
                                    const boxHeight = 2.5 * em
                                    const boxWidth = 5 * em
                                    return (
                                      <g>
                                        <Circle
                                          cx={cx}
                                          cy={cy}
                                          r={centerR}
                                          fill="url('#radial-trans')"
                                          style={canGoDown ? { cursor: 'pointer' } : {}}
                                          onClick={() => {
                                            if (canGoDown) {
                                              window.open(`?bureauId=${d.id}`)
                                            }
                                          }}
                                        />
                                        {canGoDown && isHover && createPortal((
                                          <Group top={rLabelHeight + rMax} left={cx + 2 * em}>
                                            <polygon
                                              points={[
                                                [-0.75 * em, 0],
                                                [0.1 * em, -0.5 * em],
                                                [0.1 * em, 0.5 * em]
                                              ].map(p => p.join()).join(' ')}
                                              fill={theme.colors.orange3}
                                            />
                                            <rect
                                              x={0}
                                              y={-boxHeight / 2}
                                              width={boxWidth}
                                              height={boxHeight}
                                              fill={theme.colors.orange3}
                                              rx={0.75 * em}
                                            />
                                            <text
                                              fontSize={em}
                                              fill="white"
                                              x={boxWidth / 2}
                                              y={0.3*em}
                                              textAnchor="middle"
                                            >前往局處</text>
                                          </Group>
                                        ), this.wrapper.current)}
                                      </g>
                                    )
                                  }}
                                </HoverSensor>
                              </g>
                            );
                          })}
                        </g>
                      )}
                    </NodeGroup>
                  </g>
                  <InfoSection
                    xEnd={width}
                    y={rLabelHeight + 2 * em}
                    em={em}
                    main={{
                      value: lockId ? namedData[lockId].issued : data.reduce((sum, d) => sum + d.issued, 0),
                      label: '已開案量',
                      unit: '件',
                    }}
                    sub={{
                      value: lockId ? namedData[lockId].issuedDollar : data.reduce((sum, d) => sum + d.issuedDollar, 0),
                      label: '案件金額',
                      unit: '元',
                    }}
                  />
                  <InfoSection
                    xEnd={width}
                    y={rLabelHeight + 9.5 * em}
                    em={em}
                    main={{
                      value: lockId ? namedData[lockId].received : data.reduce((sum, d) => sum + d.received, 0),
                      label: '收繳案件',
                      unit: '件',
                    }}
                    sub={{
                      value: lockId ? namedData[lockId].receivedDollar : data.reduce((sum, d) => sum + d.receivedDollar, 0),
                      label: '收繳金額',
                      unit: '元',
                    }}
                  />
                  <InfoSection
                    xEnd={width}
                    y={rLabelHeight + 18 * em}
                    em={em}
                    main={{
                      value: lockId ? namedData[lockId].canceled : data.reduce((sum, d) => sum + d.canceled, 0),
                      label: '撤銷案件量',
                      unit: '件',
                    }}
                  />
                </Fragment>
              );
            }}
          </ChartBase>
        )}
      </FontSizeContext.Consumer>
    )
  }
}

export default BubbleLine;
