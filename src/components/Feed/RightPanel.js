import React from 'react'
import { GU, useLayout } from '@1hive/1hive-ui'

import WrapToken from './WrapToken'
import HeroBanner from './HeroBanner'

import { useWallet } from '../../providers/Wallet'

function RightPanel() {
  const { account } = useWallet()
  const { layoutName } = useLayout()
  const mobileMode = layoutName === 'small'
  const tabletMode = layoutName === 'medium'
  const largeMode = layoutName === 'large' || layoutName === 'max'

  if (tabletMode) {
    return (
      <div
        css={`
          width: 100%;
          display: flex;
          flex-direction: row;
          padding: ${3 * GU}px;
        `}
      >
        {account && (
          <div
            css={`
              width: 50%;
            `}
          >
            <WrapToken />
          </div>
        )}
        <div
          css={`
            width: ${account ? '50%' : '100%'};
            margin-left: ${2 * GU}px;
          `}
        >
          <HeroBanner />
        </div>
      </div>
    )
  }
  return (
    <div
      css={`
        width: ${mobileMode ? '100%' : '327px'};
        ${largeMode &&
          `
            top: ${3 * GU}px;
            position: sticky;
            margin-top: ${3 * GU}px;
            margin-left: ${3 * GU}px;
        `}
        ${mobileMode && `margin-top: ${2 * GU}px;`}
      `}
    >
      {account && <WrapToken />}
      <HeroBanner />
    </div>
  )
}

export default RightPanel
