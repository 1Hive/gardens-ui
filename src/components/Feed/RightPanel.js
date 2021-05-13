import React from 'react'
import { GU, useLayout } from '@1hive/1hive-ui'

import WrapToken from './WrapToken'
import HeroBanner from './HeroBanner'

import { useWallet } from '../../providers/Wallet'

function RightPanel({ onRequestNewProposal, onUnwrapToken, onWrapToken }) {
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
          ${account && `padding: ${3 * GU}px ${3 * GU}px 0px;`}
        `}
      >
        {account && (
          <div
            css={`
              width: 50%;
            `}
          >
            <WrapToken
              onUnwrapToken={onUnwrapToken}
              onWrapToken={onWrapToken}
            />
          </div>
        )}
        <div
          css={`
            width: ${account ? '50%' : '100%'};
            ${account && `margin-left: ${2 * GU}px;`}
          `}
        >
          <HeroBanner onRequestNewProposal={onRequestNewProposal} />
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
        `}
        ${mobileMode && account && `margin-top: ${2 * GU}px;`}
      `}
    >
      {account && (
        <WrapToken onUnwrapToken={onUnwrapToken} onWrapToken={onWrapToken} />
      )}
      <HeroBanner onRequestNewProposal={onRequestNewProposal} />
    </div>
  )
}

export default RightPanel
