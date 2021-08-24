import React, { useCallback } from 'react'
import { GU, textStyle, Button } from '@1hive/1hive-ui'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import ProvidersImg from '../../../assets/providers.svg'

function ConectWallet({ onDismiss }) {
  const { next } = useMultiModal()
  const handleOnConnect = useCallback(() => {
    next()
  }, [next])
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      `}
    >
      <h3
        css={`
          ${textStyle('title2')}
          margin-bottom: 8px;
        `}
      >
        Connect your account
      </h3>
      <h4
        css={`
          ${textStyle('body2')}
          margin-top: ${3 * GU}px;
        `}
      >
        You need to connect your account to create a Garden
      </h4>
      <img
        css={`
          margin-top: ${3 * GU}px;
        `}
        src={ProvidersImg}
      />
      <div
        css={`
          display: flex;
          margin-top: ${3 * GU}px;
          justify-content: space-between;
          width: 100%;
        `}
      >
        <Button
          onClick={onDismiss}
          wide
          css={`
            margin-top: ${3 * GU}px;
            margin-right: ${2 * GU}px;
            width: ${30 * GU}px;
          `}
        >
          Dismiss
        </Button>
        <Button
          mode="strong"
          onClick={handleOnConnect}
          wide
          css={`
            margin-top: ${3 * GU}px;
            width: ${30 * GU}px;
          `}
        >
          Connect
        </Button>
      </div>
    </div>
  )
}

export default ConectWallet
