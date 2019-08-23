import React, { Fragment, PureComponent } from 'react';
import { Group } from '@vx/group';
import { Pie } from '@vx/shape';
import { HoverSensor } from 'libreact/lib/HoverSensor';

import FontSizeContext from 'components/ThemeProvider/FontSizeContext'

import ChartBase from 'components/Charts/ChartBase'
import PathInterpolation from 'components/Charts/PathInterpolation'

const valueGetter = d => d.issued

class TypeDonut extends PureComponent {
  static contextType = FontSizeContext

  static getDerivedStateFromProps({ data, legends }) {
    return {
      dataLength: data.length,
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
    const { data, legends, onLegendClick, activeLegend, ...props } = this.props;
    const { dataLength, getColorByName, getIndexByName } = this.state;
    return (
      <ChartBase {...props}>
        {({ width, height }) => {
          const { em } = this.context
          const donutR = height * 0.45 - 2 * em;
          const legendBottom = height - 4 * em
          return (
            <Fragment>
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
              <Group top={height / 2} left={width - donutR * 1.1}>
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
                <Pie
                  data={data}
                  pieValue={valueGetter}
                  outerRadius={donutR}
                  innerRadius={donutR * 0.4}
                  padAngle={0}
                  pieSort={(a, b) => getIndexByName[a.name] - getIndexByName[b.name]}
                >
                  {pie => {
                    return pie.arcs.map((arc, i) => {
                      const [centroidX, centroidY] = pie.path.centroid(arc);
                      const { startAngle, endAngle } = arc;
                      const hasSpaceForLabel = endAngle - startAngle >= 0.1;
                      return (
                        <HoverSensor key={`inner-${arc.data.name}-${i}`}>
                          {({ isHover }) => (
                            <g>
                              <PathInterpolation
                                d={((!activeLegend && isHover) || activeLegend === arc.data.name) && this.outerShapes[i] ? this.outerShapes[i] : pie.path(arc)}
                                fill={getColorByName[arc.data.name]}
                                opacity={!activeLegend || arc.data.name === activeLegend ? 1 : 0.3}
                                onClick={() => onLegendClick(arc.data.name === activeLegend ? null : arc.data.name)}
                              />
                              {hasSpaceForLabel && (
                                <text
                                  fill="white"
                                  x={centroidX}
                                  y={centroidY}
                                  dy=".33em"
                                  fontSize={em}
                                  textAnchor="middle"
                                >
                                  {arc.data.issued}
                                </text>
                              )}
                            </g>
                          )}
                        </HoverSensor>
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
