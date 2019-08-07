import React from 'react';
import { NodeGroup } from 'react-move'
import { max } from 'd3-array'
import { Circle } from '@vx/shape';
import { scalePower } from '@vx/scale';

import AutoScale from './AutoScale'
import Box from '../Box'

const BubbleLine = ({ data, ...props }) => {
  if (!data || !data.length) return null
  // console.log('BubbleLine', data)

  return (
    <AutoScale pt="25%" {...props}>
      {({ width, height }) => {
        const rMax = height / 2
        const xStart = rMax
        const xExtent = width - height
        const xGap = xExtent / (data.length - 1)

        const rScale = scalePower({
          domain: [0, max(data, d => d.value)],
          range: [0, rMax],
          exponent: 2,
        });

        return (
          <Box
            is="svg"
            position="absolute"
            top="0"
            left="0"
            width={width}
            height={height}
          >
            <NodeGroup
              data={data}
              keyAccessor={d => d.label}
              start={() => ({
                value: 0,
                opacity: 0.5,
              })}
              enter={d => ({
                value: [d.value],
                timing: { duration: 500 }
              })}
              update={d => ({
                value: [d.value],
                timing: { duration: 500 }
              })}
              leave={() => ({
                opacity: [0],
                timing: { duration: 500 },
              })}
            >
              {nodes => (
                <g>
                  {nodes.map(({ key, state: { value, opacity } }, i) => {
                    const cx = xStart + xGap * i;
                    const cy = rMax
                    const r = rScale(value)
                    return (
                      <Circle
                        key={key}
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="#f6c431"
                        opacity={opacity}
                      />
                    );
                  })}
                </g>
              )}
            </NodeGroup>
          </Box>
        );
    }}
    </AutoScale>
  );
};

export default BubbleLine;
