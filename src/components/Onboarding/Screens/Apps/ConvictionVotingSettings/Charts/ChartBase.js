import React from 'react'
import PropTypes from 'prop-types'
import { Card, GU } from '@1hive/1hive-ui'

const ChartBase = ({ children, height, title, width }) => (
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

export default ChartBase
