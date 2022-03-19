import React from 'react'
import PropTypes from 'prop-types'
import { GU, ButtonIcon, IconRight, IconLeft, useTheme } from '@1hive/1hive-ui'

function PrevNext({ onClick, type }) {
  const theme = useTheme()
  const next = type === 'next'
  const Icon = next ? IconRight : IconLeft

  return (
    <ButtonIcon
      onClick={onClick}
      label={next ? 'Next' : 'Previous'}
      css={`
        position: absolute;
        z-index: 1;
        top: calc(50% - ${3 * GU}px);
        height: ${6 * GU}px;
        ${next ? 'right' : 'left'}: ${0.5 * GU}px;
        color: ${theme.surfaceContentSecondary};
      `}
    >
      <Icon size="large" />
    </ButtonIcon>
  )
}

PrevNext.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['next', 'previous']).isRequired,
}

export default PrevNext
