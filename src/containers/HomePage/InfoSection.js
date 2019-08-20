import React from 'react';
import { format } from 'd3-format'
import get from 'lodash/get'

import theme from 'components/ThemeProvider/theme'

const num = format(',')

const InfoSection = ({
  xEnd,
  y,
  em,
  main,
  sub,
}) => {
  const mainYStart = y - 0.8 * em
  const subYStart = y + 1.5 * em
  const mainValueStart = xEnd - (get(main.unit, 'length', -0.25) + 0.25) * em
  const mainValueWidth = main.value.toString().length * 1.5 * em
  const mainLabelStart = mainValueStart - mainValueWidth
  const subValueStart = xEnd - (get(sub, ['unit', 'length'], -0.25) + 0.25) * em
  const subValueWidth = get(sub, 'value', '').toString().length * 0.75 * em
  const subLabelStart = subValueStart - subValueWidth
  const labelStart = Math.min(subLabelStart, mainLabelStart)
  return (
    <g>
      <line
        x1={mainLabelStart - get(main.label, 'length') * em}
        x2={xEnd}
        y1={y}
        y2={y}
        stroke="black"
        strokeWidth="2"
      />
      <g>
        {main.unit && (
          <text
            x={xEnd}
            y={mainYStart}
            textAnchor="end"
            fontSize={em}
          >
            {main.unit}
          </text>
        )}
        <text
          fill={theme.colors.primary}
          x={mainValueStart}
          y={mainYStart}
          textAnchor="end"
          fontSize={2 * em}
        >
          {num(main.value)}
        </text>
        <text
          x={labelStart}
          y={mainYStart}
          textAnchor="end"
          fontSize={em}
        >
          {main.label}
        </text>
      </g>
      {sub && (
        <g>
          <text
            x={xEnd}
            y={subYStart}
            textAnchor="end"
            fontSize={em}
          >
            {sub.unit}
          </text>
          <text
            x={subValueStart - 0.25 * em}
            y={subYStart}
            textAnchor="end"
            fontSize={em}
            color={theme.colors.gray}
          >
            {num(sub.value)}
          </text>
          <text
            x={labelStart}
            y={subYStart}
            textAnchor="end"
            fontSize={em}
          >
            {sub.label}
          </text>
        </g>
      )}
    </g>
  );
};

export default InfoSection;
