import React from 'react'
import { GU, useLayout } from '@1hive/1hive-ui'

import WrapToken from './WrapToken'
import HeroBanner from './HeroBanner'

function RightPanel() {
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small' || layoutName === 'medium'
  return (
    <div
      css={`
        width: ${compactMode ? '100%' : '327px'};
        ${!compactMode &&
          `
            top: ${3 * GU}px;
            position: sticky;
            margin-top: ${3 * GU}px;
            margin-left: ${3 * GU}px;
        `}
        ${compactMode && `margin-top: ${2 * GU}px;`}
      `}
    >
      <WrapToken />
      <HeroBanner />
    </div>
  )
}

// const LineSeparator = styled.div`
//   height: 1px;
//   border-bottom: 0.5px solid ${({ border }) => border};
//   margin: ${3 * GU}px 0;
// `

export default RightPanel
