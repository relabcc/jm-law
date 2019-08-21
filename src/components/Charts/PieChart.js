import React from 'react';
import { Group } from '@vx/group';
import { Pie } from '@vx/shape';

import theme from '../ThemeProvider/theme'

import ChartBase from './ChartBase'

const PieChart = ({
  data,
  ...props
}) => {
  return (
    <ChartBase {...props}>
      {({ width, height }) => {
        const em = Math.floor(width / 30)
        const donutR = height / 2 - 2 * em;
        return (
          <Group top={height / 2} left={width - donutR}>
            <Pie
              data={data.sort((a, b) => a.iss)}
              pieValue={d => d.issued}
              outerRadius={donutR}
              innerRadius={donutR * 0.5}
              padAngle={0}
            >
              {pie => {
                return pie.arcs.map((arc, i) => {
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  const { startAngle, endAngle } = arc;
                  const hasSpaceForLabel = endAngle - startAngle >= 0.1;
                  return (
                    <g key={`${arc.data.name}-${i}`}>
                      <path d={pie.path(arc)} fill={theme.colors.spectrum[theme.colors.spectrum.length - 1 - i]} />
                      {hasSpaceForLabel && (
                        <text
                          fill="black"
                          x={centroidX}
                          y={centroidY}
                          dy=".33em"
                          fontSize={em}
                          textAnchor="middle"
                        >
                          {arc.data.name}
                        </text>
                      )}
                    </g>
                  );
                });
              }}
            </Pie>
          </Group>
        )
      }}
    </ChartBase>
  );
};

export default PieChart;
