import React, { Fragment } from 'react';
import { Group } from '@vx/group';
import { scaleLinear } from '@vx/scale';
import { Animate } from 'react-move'
import sortBy from 'lodash/sortBy'

import FontSizeContext from 'components/ThemeProvider/FontSizeContext'

import ChartBase from 'components/Charts/ChartBase'
import LineBreakText from 'components/Charts/LineBreakText'
import withData from 'services/api/withData'

const labelLength = 15

const LawTop5 = (props) => {
  const data = props['data/bureaus/laws']
  console.log(data)
  const sorted = sortBy(data, 'count')
  return (
    <FontSizeContext.Consumer>
      {({ em }) => (
        <ChartBase ratio={0.27}>
          {({ width }) => {
            const yStart = em * 2.5
            return (
              <Group top={yStart}>
                {sorted.map((law, i) => (
                  <Group key={law.id} top={i * em * 3}>
                    <LineBreakText
                      fill="white"
                      fontSize={em}
                      maxLength={labelLength}
                      fillFront
                    >
                      {law.name}
                    </LineBreakText>
                  </Group>
                ))}
              </Group>
            )
          }}
        </ChartBase>
      )}
    </FontSizeContext.Consumer>
  );
};

export default withData('data/bureaus/laws', { top: 5 })(LawTop5);
