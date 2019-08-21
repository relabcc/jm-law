import React, { Fragment } from 'react';
import { Group } from '@vx/group';
import { Pie } from '@vx/shape';

import theme from 'components/ThemeProvider/theme'

import ChartBase from 'components/Charts/ChartBase'

const valueGetter = d => d.issued
const sepctrumColors = Array.from(theme.colors.spectrum).reverse()

const PieChart = ({
  data,
  ...props
}) => {
  const sorted = data.sort((a, b) => valueGetter(b) - valueGetter(a))
  const dataLength = sorted.length
  return (
    <ChartBase {...props}>
      {({ width, height }) => {
        const em = Math.floor(width / 30)
        const donutR = height * 0.45 - 2 * em;
        const legendBottom = height - 4 * em
        return (
          <Fragment>
            <g>
              {sorted.map((type, i) => (
                <Group key={i} left={em} top={legendBottom - (dataLength - 1 - i) * em * 1.75}>
                  <circle cx={em / 2} cy={-em * 0.3} r={em / 2} fill={sepctrumColors[i]} />
                  <text x={1.75 * em} fill="white" fontSize={em}>{type.name}</text>
                </Group>
              ))}
            </g>
            <Group top={height / 2} left={width - donutR * 1.1}>
              <Pie
                data={sorted}
                pieValue={valueGetter}
                outerRadius={donutR * 1.1}
                innerRadius={donutR * 0.3}
                padAngle={0}
              >
                {pie => pie.arcs.map((arc, i) => (
                    <g key={`${arc.data.name}-${i}`}>
                      <path d={pie.path(arc)} fill="white" opacity="0.2" />
                    </g>
                  ))
                }
              </Pie>
              <Pie
                data={sorted}
                pieValue={valueGetter}
                outerRadius={donutR}
                innerRadius={donutR * 0.4}
                padAngle={0}
              >
                {pie => {
                  return pie.arcs.map((arc, i) => {
                    const [centroidX, centroidY] = pie.path.centroid(arc);
                    const { startAngle, endAngle } = arc;
                    const hasSpaceForLabel = endAngle - startAngle >= 0.1;
                    return (
                      <g key={`${arc.data.name}-${i}`}>
                        <path
                          d={pie.path(arc)}
                          fill={sepctrumColors[i]}
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
};

export default PieChart;
