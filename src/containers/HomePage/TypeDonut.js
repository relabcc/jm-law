import React, { Fragment, PureComponent } from 'react';
import { Group } from '@vx/group';
import { Pie } from '@vx/shape';
import { scaleBand } from '@vx/scale';
import { HoverSensor } from 'libreact/lib/HoverSensor';
import { format } from 'd3-format'
import { pie } from 'd3-shape'
import groupBy from 'lodash/groupBy'
import reduce from 'lodash/reduce'
import range from 'lodash/range'
import mapValues from 'lodash/mapValues'

import FontSizeContext from '../../components/ThemeProvider/FontSizeContext'
import theme from '../../components/ThemeProvider/theme'

import ChartBase from '../../components/Charts/ChartBase'
import TweenShape from '../../components/Charts/PathInterpolation'

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
    const spaceForLabels = pie().value(valueGetter)(data).map(({ startAngle, endAngle }) => endAngle - startAngle >= 0.1)
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
      spaceForLabels,
      notEnoughSpace: !spaceForLabels.every(Boolean),
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
      spaceForLabels,
      notEnoughSpace,
    } = this.state;
    const { em } = this.context
    const stroke = showLabel ? 'black' : 'white'
    return (
      <ChartBase {...props}>
        {({ width, height }) => {
          const donutR = height * 0.45 - (showLabel ? 8 * em : (notEnoughSpace ? 4 * em : 2 * em));
          const legendBottom = height - 4 * em
          return (
            <Fragment>
              {showLegend && (
                <g>
                  {legends.map((legend, i) => (
                    <Group
                      key={i}
                      left={notEnoughSpace ? 0 : em}
                      top={legendBottom - (dataLength - 1 - i) * em * 1.75}
                      onClick={() => onLegendClick(legend.label === activeLegend ? null : legend.label)}
                      opacity={!activeLegend || legend.label === activeLegend ? 1 : 0.3}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx={em / 2} cy={-em * 0.3} r={em / 2} fill={legend.color} />
                      <text x={(notEnoughSpace ? 1.5 : 1.75) * em} fill="white" fontSize={em}>{legend.label}</text>
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
                    if (showLabel || notEnoughSpace) {
                      const sides = groupBy(pie.arcs.map((arc, i) => calcSide(pie.path.centroid(arc), i)), 'side')
                      const sideGroups = reduce(sides, (so, s, i) => {
                        const filteredS = s.filter(sd => pie.arcs[sd.index].value)
                        let ss = so[i] ? filteredS.concat(so[i]) : filteredS
                        if (filteredS.length > labelLength) {
                          const sorted = filteredS.sort((a, b) => b.distanceX - a.distanceX)
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
                      const value = valueGetter(arc.data)
                      const opacity = (!activeLegend || arc.data.name === activeLegend) ? 1 : 0.3
                      return (
                        <Fragment key={`inner-${arc.data.name}-${i}`}>
                          <HoverSensor>
                            {({ isHover }) => (
                              <g>
                                <TweenShape
                                  d={((!activeLegend && isHover) || activeLegend === arc.data.name) && this.outerShapes[i] ? this.outerShapes[i] : pie.path(arc)}
                                  fill={getColorByName[arc.data.name]}
                                  opacity={opacity}
                                  onClick={() => onLegendClick(arc.data.name === activeLegend ? null : arc.data.name)}
                                  duration={150}
                                />
                                {arc.value && spaceForLabels[i] && (
                                  <text
                                    fill="white"
                                    x={centroidX}
                                    y={centroidY}
                                    dy=".33em"
                                    fontSize={em}
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    opacity={opacity}
                                    style={{ pointerEvents: 'none' }}
                                  >
                                    {showPercentage ? p(value / totalVaue) : value}
                                  </text>
                                )}
                              </g>
                            )}
                          </HoverSensor>

                          {(showLabel || !spaceForLabels[i]) && (() => {
                            const side = sideOrders[i]
                            if (!side) return null
                            const scale = scaleLabelY[side.side]
                            const sign = side.side
                            const left = (donutR + (showLabel ? 8 * em : 4.5 * em)) * sign
                            const top = scale(side.index) + scale.bandwidth() / 2 - em / 2
                            const centX = centroidX - left + (spaceForLabels[i] ? 2 * em * sign : 0)
                            const centY = centroidY - top
                            const breakX = centX + Math.abs(centY) * sign
                            return (
                              <Fragment>
                                <Group
                                  left={left}
                                  top={top}
                                  opacity={opacity}
                                >
                                  <line
                                    x1={0}
                                    x2={breakX}
                                    y1={0}
                                    y2={0}
                                    stroke={stroke}
                                  />
                                  <line
                                    x1={centX}
                                    y1={centY}
                                    x2={breakX}
                                    y2={0}
                                    stroke={stroke}
                                  />
                                  <text
                                    y={1.5 * em}
                                    textAnchor={sign > 0 ? 'end' : 'start'}
                                    fontSize={(showLabel ? 1 : 0.9) * em}
                                    fontWeight="bold"
                                  >{arc.data.name}</text>
                                  <text
                                    y={-0.75 * em}
                                    textAnchor={sign > 0 ? 'end' : 'start'}
                                    fontSize={(showLabel ? 1.5 : 1) * em}
                                    fill={showLabel ? theme.colors.primary : getColorByName[arc.data.name]}
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
