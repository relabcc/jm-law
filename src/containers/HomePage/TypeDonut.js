import React, { Fragment, PureComponent } from 'react';
import { Group } from '@vx/group';
import { Pie } from '@vx/shape';
import { scaleBand } from '@vx/scale';
import { HoverSensor } from 'libreact/lib/HoverSensor';
import { format } from 'd3-format'
import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'
import range from 'lodash/range'
import mapValues from 'lodash/mapValues'

import FontSizeContext from '../../components/ThemeProvider/FontSizeContext'
import theme from '../../components/ThemeProvider/theme'

import ChartBase from '../../components/Charts/ChartBase'
import TweenShape from '../../components/Charts/TweenShape'

const p = format('.0%')

const calcSide = (centroid, index) => {
  return {
    side: Math.sign(centroid[0]),
    distanceX: Math.abs(centroid[0]),
    distanceY: centroid[1],
    index,
  }
}

class TypeDonut extends PureComponent {
  static contextType = FontSizeContext

  static defaultProps = {
    onLegendClick: () => {}
  }

  static getDerivedStateFromProps({ data, legends, valueGetter }) {
    return {
      totalVaue: data.reduce((sum, d) => sum + valueGetter(d), 0),
      dataLength: data.length,
      labelLength: Math.floor(data.length / 2) + 1,
      getColorByName: legends.reduce((cn, l) => {
        cn[l.label] = l.color
        return cn
      }, {}),
      getIndexByName: legends.reduce((cn, l, i) => {
        cn[l.label] = i
        return cn
      }, {}),
    }
  }

  state = {}

  outerShapes = []

  handleOuterShape = (i, shape) => {
    this.outerShapes[i] = shape
  }

  render() {
    const {
      data,
      legends,
      onLegendClick,
      activeLegend,
      valueGetter,
      outerCircle,
      showLegend,
      showLabel,
      showPercentage,
      ...props
    } = this.props;
    const {
      totalVaue,
      dataLength,
      labelLength,
      getColorByName,
      getIndexByName,
    } = this.state;
    const { em } = this.context
    return (
      <ChartBase {...props}>
        {({ width, height }) => {
          const donutR = height * 0.45 - (showLabel ? 8 * em : 2 * em);
          const legendBottom = height - 4 * em
          return (
            <Fragment>
              {showLegend && (
                <g>
                  {legends.map((legend, i) => (
                    <Group
                      key={i}
                      left={em}
                      top={legendBottom - (dataLength - 1 - i) * em * 1.75}
                      onClick={() => onLegendClick(legend.label === activeLegend ? null : legend.label)}
                      opacity={!activeLegend || legend.label === activeLegend ? 1 : 0.3}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx={em / 2} cy={-em * 0.3} r={em / 2} fill={legend.color} />
                      <text x={1.75 * em} fill="white" fontSize={em}>{legend.label}</text>
                    </Group>
                  ))}
                </g>
              )}
              <Group top={height / 2} left={width / 2 + (showLegend ? 5 * em : 0)}>
                {outerCircle && (
                  <Fragment>
                    <Pie
                      data={data}
                      pieValue={valueGetter}
                      outerRadius={donutR * 1.05}
                      innerRadius={donutR * 0.4}
                      padAngle={0}
                      pieSort={(a, b) => getIndexByName[a.name] - getIndexByName[b.name]}
                    >
                      {pie => pie.arcs.map((arc, i) => {
                        const d = pie.path(arc)
                        return (
                          <g key={`outer-${arc.data.name}-${i}`}>
                            <path d={d} fill="transparent" ref={() => this.handleOuterShape(i, d)} />
                          </g>
                        )
                      })}
                    </Pie>
                    <Pie
                      data={data}
                      pieValue={valueGetter}
                      outerRadius={donutR * 1.1}
                      innerRadius={donutR * 0.3}
                      padAngle={0}
                    >
                      {pie => pie.arcs.map((arc, i) => (
                        <g key={`bg-${arc.data.name}-${i}`}>
                          <path d={pie.path(arc)} fill="white" opacity="0.2" />
                        </g>
                      ))}
                    </Pie>
                  </Fragment>
                )}
                <Pie
                  data={data}
                  pieValue={valueGetter}
                  outerRadius={donutR}
                  innerRadius={donutR * 0.4}
                  padAngle={0}
                  pieSort={(a, b) => getIndexByName[a.name] - getIndexByName[b.name]}
                >
                  {pie => {
                    let sideOrders
                    let scaleLabelY
                    if (showLabel) {
                      const sides = groupBy(pie.arcs.map((arc, i) => calcSide(pie.path.centroid(arc), i)), 'side')
                      const sideGroups = reduce(sides, (so, s, i) => {
                        let ss = so[i] ? s.concat(so[i]) : s
                        if (s.length > labelLength) {
                          const sorted = s.sort((a, b) => b.distanceX - a.distanceX)
                          ss = sorted.slice(0, labelLength)
                          const otherI = i * -1
                          so[otherI] = (so[otherI] || []).concat(sorted.slice(labelLength))
                        }
                        so[i] = ss
                        return so
                      }, {})
                      scaleLabelY = mapValues(sideGroups, s => scaleBand({
                        range: [-donutR, donutR],
                        domain: range(0, s.length),
                      }))
                      sideOrders = reduce(sideGroups, (so, s) => {
                        const sorted = s.sort((a, b) => a.distanceY - b.distanceY)
                        sorted.forEach((d, index) => {
                          so[d.index] = { side: d.side, index }
                        })
                        return so
                      }, [])
                    }
                    return pie.arcs.map((arc, i) => {
                      const [centroidX, centroidY] = pie.path.centroid(arc);
                      const { startAngle, endAngle } = arc;
                      const hasSpaceForLabel = endAngle - startAngle >= 0.1;
                      const value = valueGetter(arc.data)
                      return (
                        <Fragment key={`inner-${arc.data.name}-${i}`}>
                          <HoverSensor>
                            {({ isHover }) => (
                              <g>
                                <TweenShape
                                  d={((!activeLegend && isHover) || activeLegend === arc.data.name) && this.outerShapes[i] ? this.outerShapes[i] : pie.path(arc)}
                                  fill={getColorByName[arc.data.name]}
                                  opacity={(!activeLegend || arc.data.name === activeLegend) ? 1 : 0.3}
                                  onClick={() => onLegendClick(arc.data.name === activeLegend ? null : arc.data.name)}
                                  duration={200}
                                />
                                {hasSpaceForLabel && (
                                  <text
                                    fill="white"
                                    x={centroidX}
                                    y={centroidY}
                                    dy=".33em"
                                    fontSize={em}
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    style={{ pointerEvents: 'none' }}
                                  >
                                    {showPercentage ? p(value / totalVaue) : value}
                                  </text>
                                )}

                              </g>
                            )}
                          </HoverSensor>
                          {showLabel && (() => {
                            const side = sideOrders[i]
                            const scale = scaleLabelY[side.side]
                            const sign = side.side
                            const left = (donutR + 8 * em)* sign
                            const top = scale(side.index) + scale.bandwidth() / 2 - em / 2
                            const centX = centroidX - left + 2 * em * sign
                            const centY = centroidY - top
                            const breakX = centX + Math.abs(centY) * sign
                            return (
                              <Fragment>
                                <Group
                                  left={left}
                                  top={top}
                                >
                                  <line
                                    x1={0}
                                    x2={breakX}
                                    y1={0}
                                    y2={0}
                                    stroke="black"
                                  />
                                  <line
                                    x1={centX}
                                    y1={centY}
                                    x2={breakX}
                                    y2={0}
                                    stroke="black"
                                  />
                                  <text
                                    y={1.5 * em}
                                    textAnchor={sign > 0 ? 'end' : 'start'}
                                    fontSize={em}
                                    fontWeight="bold"
                                  >{arc.data.name}</text>
                                  <text
                                    y={-0.75 * em}
                                    textAnchor={sign > 0 ? 'end' : 'start'}
                                    fontSize={1.5 * em}
                                    fill={theme.colors.primary}
                                    fontWeight="bold"
                                  >{valueGetter(arc.data)}</text>
                                </Group>
                              </Fragment>
                            )
                          })()}
                        </Fragment>
                      );
                    });
                  }}
                </Pie>
              </Group>
            </Fragment>
          )
        }}
      </ChartBase>
    );
  }
}

export default TypeDonut;
