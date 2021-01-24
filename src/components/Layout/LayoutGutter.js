import React from 'react'
import { useLayout, GU } from '@1hive/1hive-ui'

function LayoutGutter({ children, collapseWhenSmall, ...props }) {
  const { layoutName } = useLayout()

  const smallPaddingAmount = collapseWhenSmall ? 0 : 2 * GU
  const paddingAmount =
    layoutName === 'small' ? `${smallPaddingAmount}px` : '5%'

  return (
    <div
      css={`
        padding-left: ${paddingAmount};
        padding-right: ${paddingAmount};
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export default LayoutGutter
