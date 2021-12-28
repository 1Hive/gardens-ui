import React from 'react'

import PropTypes from 'prop-types'

import { GU, textStyle, useTheme } from '@1hive/1hive-ui'

import useNow from '@hooks/useNow'

import { getRelativeTime } from '@utils/date-utils'

function TimeTag({ date, label, ...props }) {
  const theme = useTheme()
  const now = useNow()
  return (
    <div
      css={`
        max-width: ${15.75 * GU}px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: ${theme.surfaceContentSecondary};
        ${textStyle('label2')};
      `}
      {...props}
    >
      {label || getRelativeTime(now, date)}
    </div>
  )
}

TimeTag.propTypes = {
  date: PropTypes.number.isRequired, // unix timestamp
  label: PropTypes.node,
}

export default TimeTag
