import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { GU, LoadingRing, textStyle } from '@1hive/1hive-ui'

const SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
}

function Loading({ center = true, height, size = SIZES.MEDIUM }) {
  const style = useMemo(() => {
    if (size === SIZES.SMALL) {
      return 'body3'
    }
    if (size === SIZES.MEDIUM) {
      return 'body2'
    }
    if (size === SIZES.LARGE) {
      return 'body1'
    }
  }, [size])

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: ${center ? 'center' : 'flex-start'};

        margin: 0 auto;
        height: ${height ? `${height}px` : 'auto'};
      `}
    >
      <LoadingRing />
      <span
        css={`
          ${textStyle(style)};
          margin-left: ${1 * GU}px;
        `}
      >
        Loading…
      </span>
    </div>
  )
}

Loading.propTypes = {
  center: PropTypes.bool,
  height: PropTypes.number,
  size: PropTypes.oneOf([SIZES.SMALL, SIZES.MEDIUM, SIZES.LARGE]).isRequired,
}

export default Loading
