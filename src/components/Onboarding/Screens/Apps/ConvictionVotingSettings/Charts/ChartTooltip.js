import { textStyle, useTheme } from '@1hive/1hive-ui'
import PropTypes from 'prop-types'
import React from 'react'

const ChartTooltip = ({ xLabel, xValue, yLabel, yValue }) => {
  const theme = useTheme()

  return (
    <div
      css={`
        background: ${theme.helpSurface};
        padding: 9px 12px;
        border: 1px solid ${theme.border};
        ${textStyle('body3')}
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

export default ChartTooltip
