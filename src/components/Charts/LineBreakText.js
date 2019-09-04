import React from 'react';

function backwardAutoLineBreak(str, maxLength, fillFront) {
  if (!maxLength) return [str]
  const strArr = Array.from(str)
  if (!fillFront) strArr.reverse()
  let i = 0
  const lines = strArr.reduce((lines, st) => {
    lines[i] = lines[i] || ''
    if (lines[i].length == maxLength) {
      i += 1
      lines[i] = ''
    }
    if (fillFront) {
      lines[i] += st
    } else {
      lines[i] = st + lines[i]
    }
    return lines
  }, [])
  if (!fillFront) {
    lines.reverse()
  }
  if (fillFront) {
    const { length } = lines
    if (lines[length - 1].length === 1) {
      lines[length - 1] = lines[length - 2].substr(lines[length - 2].length - 1) + lines[length - 1]
      lines[length - 2] = lines[length - 2].substr(0, lines[length - 2].length - 1)
    }
  } else {
    if (lines[0].length === 1) {
      lines[0] += lines[1][0]
      lines[1] = lines[1].substr(1)
    }
  }
  return lines
}

const LineBreakText = ({
  x,
  y,
  children,
  fontSize,
  maxLength,
  lineHeight,
  lineBefore,
  fillFront,
  bg,
  style,
  verticalCenter,
  ...props
}) => {
  if (typeof children !== 'string') {
    return (
      <text
        x={x}
        y={y}
        fontSize={fontSize}
        style={style}
        {...props}
      >
        {children}
      </text>
    );
  }
  const lines = backwardAutoLineBreak(children, maxLength, fillFront)
  const lineCount = lines.length
  const yPos = lines.map((c, i) => y + (verticalCenter && lineCount > 1 ? (0.5 * fontSize * (lineBefore ? 1 : -1)) : 0) + lineHeight * fontSize * (lineBefore ? i - lineCount + 1 : i));
  const texts = lines.map((c, i) => (
    <text
      key={i}
      x={x}
      y={yPos[i]}
      fontSize={fontSize}
      style={style}
      {...props}
    >
      {c}
    </text>
  ))
  return bg ? (() => {
    const w = maxLength * fontSize
    const yStart = Math.min(...yPos)
    const yEnd = Math.max(...yPos)
    return (
      <g>
        <rect
          width={w}
          height={yEnd - yStart + 1.75 * fontSize}
          x={x - w / 2}
          y={yStart - 1.25 * fontSize}
          fill={bg}
          style={style}
        />
        {texts}
      </g>
    )
  })() : <g>{texts}</g>;
};

LineBreakText.defaultProps = {
  lineHeight: 1.3,
  y: 0,
  verticalCenter: true,
}

export default LineBreakText;
