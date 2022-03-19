import React from 'react'
import { GU, IconConnect, RADIUS, textStyle, useTheme } from '@1hive/1hive-ui'

function AccountNotConnected() {
  const theme = useTheme()

  return (
    <div
      css={`
        border-radius: ${RADIUS}px;
        background: ${theme.background};
        padding: ${3.5 * GU}px ${10 * GU}px;
        text-align: center;
      `}
    >
      <div
        css={`
          ${textStyle('body1')};
        `}
      >
        You must enable your account to interact on this proposal
      </div>
      <div
        css={`
          ${textStyle('body2')};
          color: ${theme.surfaceContentSecondary};
          margin-top: ${2 * GU}px;
        `}
      >
        Connect to your Ethereum provider by clicking on the{' '}
        <strong
          css={`
            display: inline-flex;
            align-items: center;
            position: relative;
            top: 7px;
          `}
        >
          <IconConnect /> Enable account
        </strong>{' '}
        button on the header. You may be temporarily redirected to a new screen.
      </div>
    </div>
  )
}

export default AccountNotConnected
