import React, { Fragment, PureComponent, createRef } from 'react';
import { createPortal } from 'react-dom'
import { Group } from '@vx/group';
import { scalePoint, scaleLinear } from '@vx/scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { Grid } from '@vx/grid';
import { AreaClosed, Bar, Line } from '@vx/shape';
import { withTooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import range from 'lodash/range'
import { NodeGroup } from 'react-move'
import styled from 'styled-components';

import FontSizeContext from 'components/ThemeProvider/FontSizeContext'
import theme from 'components/ThemeProvider/theme'

import Text from 'components/Text'
import Box from 'components/Box'

import ChartBase from 'components/Charts/ChartBase'
import TweenShape from 'components/Charts/TweenShape'

const TooltipBox = styled(Box)`
  &::after {
    content: "";
    display: block;
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 0.5em solid transparent;
    border-right: 0.5em solid transparent;

    border-top: 0.5em solid ${theme.colors.darkerBlue};
  }
`

const xValue = d => d.index
const yValue = d => d.issued
const yCancealedValue = d => d.canceled

const getZeros = n => {
  if (n < 10) return 0
  let i = 0
  while (n / (10 ** i) > 10) {
    i += 1
  }
  return i
}

class IssuedChart extends PureComponent {
  wrapper = createRef()

  handleTooltip = ({ event, data, xScale, yScale, xStart }) => {
    const { showTooltip } = this.props;
    const { x } = localPoint(event);
    const index = Math.round((x - xStart) / xScale.step());
    const d = data[index];
    showTooltip({
      tooltipData: Object.assign({ canceledTop: yScale(yCancealedValue(d)) }, d),
      tooltipLeft: xScale(xValue(d)) + xStart,
      tooltipTop: yScale(yValue(d)),
    });
  }

  render() {
    const {
      data,
      xTickFormat,
      showTooltop,
      hideTooltip,
      tooltipData,
      tooltipTop,
      tooltipLeft,
      events,
      ...props
    } = this.props
    return (
      <div ref={this.wrapper}>
        <FontSizeContext.Consumer>
          {({ em }) => (
            <Fragment>
              <ChartBase {...props}>
                {({ width, height }) => {
                  const yStart = 6 * em
                  const yEnd = height - 2 * em
                  const yHeight = yEnd - yStart
                  const xStart = em * 3
                  const xEnd = width - 2 * em
                  const xScale = scalePoint({
                    range: [0, xEnd - xStart],
                    domain: range(0, data.length),
                    // padding: 0.2,
                  })
                  const yMax = Math.max(...data.map(yValue))
                  const z = getZeros(yMax)
                  const yScale = scaleLinear({
                    range: [yHeight, 0],
                    domain: [0, Math.ceil(yMax / (10 ** z)) * (10 ** z)],
                  });
                  return (
                    <Group>
                      <Group top={yStart} left={xStart}>
                        <AreaClosed
                          x={dd => xScale(xValue(dd))}
                          y={dd => yScale(yValue(dd))}
                          yScale={yScale}
                        >
                          {({ path }) => (
                            <TweenShape
                              d={path(data)}
                              stroke={theme.colors.lightOrange}
                              fill={theme.colors.lightOrange}
                              opacity={0.7}
                              duration={500}
                            />
                          )}
                        </AreaClosed>
                        <AreaClosed
                          x={dd => xScale(xValue(dd))}
                          y={dd => yScale(yCancealedValue(dd))}
                          yScale={yScale}
                        >
                          {({ path }) => (
                            <TweenShape
                              d={path(data)}
                              stroke={theme.colors.orange}
                              fill={theme.colors.orange}
                              duration={500}
                            />
                          )}
                        </AreaClosed>
                        <Grid
                          top={0}
                          left={0}
                          xScale={xScale}
                          yScale={yScale}
                          stroke={theme.colors.gray}
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
                          scale={yScale}
                          numTicks={3}
                          stroke="black"
                          strokeWidth={1.5}
                          tickStroke="none"
                          tickLabelProps={() => ({
                            fill: 'black',
                            textAnchor: 'end',
                            fontSize: em * 0.8,
                            dx: '-0.25em',
                            dy: '0.25em'
                          })}
                        />
                        <AxisBottom
                          top={yHeight}
                          left={0}
                          scale={xScale}
                          numTicks={12}
                          stroke="black"
                          strokeWidth={1.5}
                          tickStroke="none"
                          tickFormat={xTickFormat}
                          tickLabelProps={() => ({
                            fill: 'black',
                            fontSize: em * 0.8,
                            textAnchor: 'middle',
                          })}
                        />
                        {tooltipData && (
                          <Line
                            from={{ x: tooltipLeft - xStart, y: tooltipTop }}
                            to={{ x: tooltipLeft - xStart, y: yHeight }}
                            stroke="white"
                            strokeWidth={2}
                            style={{ pointerEvents: 'none' }}
                          />
                        )}
                        <NodeGroup
                          data={data}
                          keyAccessor={xValue}
                          start={d => ({
                            xPos: xScale(xValue(d)),
                            dotY: yScale(yValue(d)),
                            dotCanceledY: yScale(yCancealedValue(d)),
                          })}
                          enter={d => ({
                            dotY: [yScale(yValue(d))],
                            timing: { duration: 500 },
                          })}
                          update={d => ({
                            xPos: [xScale(xValue(d))],
                            dotY: [yScale(yValue(d))],
                            dotCanceledY: [yScale(yCancealedValue(d))],
                            timing: { duration: 500 },
                          })}
                        >
                          {nodes => (
                            <Fragment>
                              {nodes.map(({ key, data: d, state: { xPos, dotY, dotCanceledY } }) => {
                                return (
                                  <Fragment key={key}>
                                    <circle
                                      cx={xPos}
                                      cy={dotY}
                                      r={em / 4}
                                      fill={theme.colors.spectrum[3]}
                                    />
                                    <circle
                                      cx={xPos}
                                      cy={dotCanceledY}
                                      r={em / 4}
                                      fill={theme.colors.spectrum[3]}
                                    />
                                  </Fragment>
                                )
                              })}
                            </Fragment>
                          )}
                        </NodeGroup>
                      </Group>
                      <Group top={1.75 * em} left={xEnd - 16 * em}>
                        <Group>
                          <text>案件量</text>
                          <rect
                            x={4 * em}
                            y={-1 * em}
                            width={3 * em}
                            height={em}
                            fill={theme.colors.lightOrange}
                            opacity={0.7}
                          />
                        </Group>
                        <Group left={8 * em}>
                          <text>撤銷件數</text>
                          <rect
                            x={5.5 * em}
                            y={-1 * em}
                            width={3 * em}
                            height={em}
                            fill={theme.colors.orange}
                          />
                        </Group>
                      </Group>
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
                            xStart,
                            yScale,
                            data,
                          })
                        }
                        onTouchMove={event =>
                          this.handleTooltip({
                            event,
                            xScale,
                            xStart,
                            yScale,
                            data,
                          })
                        }
                        onMouseMove={event =>
                          this.handleTooltip({
                            event,
                            xScale,
                            xStart,
                            yScale,
                            data,
                          })
                        }
                        onMouseLeave={() => hideTooltip()}
                      />
                      {tooltipData && (
                        <g>
                          <circle
                            cx={tooltipLeft}
                            cy={tooltipTop + yStart}
                            r={em / 2}
                            fill={theme.colors.darkBlue}
                            style={{ pointerEvents: 'none' }}
                          />
                          <circle
                            cx={tooltipLeft}
                            cy={tooltipData.canceledTop + yStart}
                            r={em / 2}
                            fill={theme.colors.darkBlue}
                            style={{ pointerEvents: 'none' }}
                          />
                        </g>
                      )}
                      {tooltipData && createPortal((
                        <TooltipBox
                          position="absolute"
                          top={tooltipTop - 0.5 * em}
                          left={tooltipLeft}
                          transform="translateX(-50%)"
                          p="1em"
                          bg="black"
                          color="white"
                          whiteSpace="nowrap"
                          gradient="darkBlue"
                          borderRadius="0.5em"
                          zIndex={10}
                        >
                          <Text>案件量 {yValue(tooltipData)}</Text>
                          <Text>撤銷數 {yCancealedValue(tooltipData)}</Text>
                        </TooltipBox>
                      ), this.wrapper.current)}
                    </Group>
                  )
                }}
              </ChartBase>
            </Fragment>
          )}
        </FontSizeContext.Consumer>
      </div>
    );
  }
}

export default withTooltip(IssuedChart);
