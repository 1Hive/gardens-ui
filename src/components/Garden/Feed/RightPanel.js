import React from 'react'
import { GU, useLayout } from '@1hive/1hive-ui'

import WrapToken from './WrapToken'
import HeroBanner from './HeroBanner'

import { useWallet } from '@providers/Wallet'
import { useGardenState } from '@providers/GardenState'

function RightPanel({ onRequestNewProposal, onUnwrapToken, onWrapToken }) {
  const { account } = useWallet()
  const { layoutName } = useLayout()
  const { wrappableToken } = useGardenState() // Todo find a better way to identify a byot gardes rather than just using the wrappable token attr

  const mobileMode = layoutName === 'small'
  const tabletMode = layoutName === 'medium'
  const largeMode = layoutName === 'large' || layoutName === 'max'

  const showWrapComponent = account && wrappableToken

  if (tabletMode) {
    return (
      <div
        css={`
          width: 100%;
          display: flex;
          flex-direction: row;
          ${showWrapComponent && `padding: ${3 * GU}px ${3 * GU}px 0px;`}
        `}
      >
        {showWrapComponent && (
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
            width: ${showWrapComponent ? '50%' : '100%'};
            ${showWrapComponent && `margin-left: ${2 * GU}px;`}
          `}
        >
          <HeroBanner
            onRequestNewProposal={onRequestNewProposal}
            fullScreenMode={!showWrapComponent}
          />
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
        ${showWrapComponent && mobileMode && `margin-top: ${2 * GU}px;`}
      `}
    >
      {showWrapComponent && (
        <WrapToken onUnwrapToken={onUnwrapToken} onWrapToken={onWrapToken} />
      )}
      <div
        css={`
          ${mobileMode && showWrapComponent && `margin-top: ${2 * GU}px;`}}
        `}
      >
        <HeroBanner onRequestNewProposal={onRequestNewProposal} />
      </div>
    </div>
  )
}

export default RightPanel
