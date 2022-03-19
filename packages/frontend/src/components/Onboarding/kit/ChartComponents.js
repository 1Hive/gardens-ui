import React from 'react'
import PropTypes from 'prop-types'
import { Card, GU, textStyle, useTheme } from '@1hive/1hive-ui'

export const ChartBase = ({ children, height, title, width }) => (
  <div>
    {title && (
      <div
        css={`
          margin-bottom: ${1 * GU}px;
        `}
      >
        {title}
      </div>
    )}
    <Card
      height={height}
      width={width}
      css={`
        padding: ${0.5 * GU}px;
      `}
    >
      {children}
    </Card>
  </div>
)

ChartBase.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.string.isRequired,
  title: PropTypes.node,
  width: PropTypes.string.isRequired,
}

export const ChartTooltip = ({ xLabel, xValue, yLabel, yValue }) => {
  const theme = useTheme()

  return (
    <div
      css={`
        background: ${theme.helpSurface};
        padding: 9px 12px;
        border: 1px solid ${theme.border};
        ${textStyle('body3')};
      `}
    >
      <div>
        <strong>{xLabel}: </strong> {xValue}
      </div>
      <div>
        <strong>{yLabel}: </strong> {yValue}
      </div>
    </div>
  )
}

ChartTooltip.propTypes = {
  xLabel: PropTypes.node.isRequired,
  xValue: PropTypes.node.isRequired,
  yLabel: PropTypes.node.isRequired,
  yValue: PropTypes.node.isRequired,
}
