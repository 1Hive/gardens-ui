import React from 'react'
import { Button, ButtonBase, IconConnect, IconCanvas } from '@1hive/1hive-ui'
import { switchNetwork } from '@/networks'

import useSupportedChain from '@/hooks/useSupportedChain'
import AccountConnectedButton from './ConnectedButton'

type WrongNetworkButton = {
  compact: any
}

const WrongNetworkButton = ({ compact }: WrongNetworkButton) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gap: '8px',
      }}
    >
      <Button
        icon={<IconCanvas />}
        label="Switch wallet to xDai"
        onClick={async () => await switchNetwork(100)}
        display={compact ? 'icon' : 'all'}
        style={{
          boxShadow: 'none',
        }}
      />
      <ButtonBase
        css={`
          background-color: rgb(255, 104, 113);
          border: 1px solid rgb(255, 104, 113);
          color: #fff;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px 0 16px;
          width: 100%;
          height: 40px;
        `}
      >
        Wrong Network
      </ButtonBase>
    </div>
  )
}

type HeaderButtonProps = {
  screenId: string
  toggle: () => void
  compact: any
}

const HeaderButtons = ({ screenId, toggle, compact }: HeaderButtonProps) => {
  const isSupportedNetwork = useSupportedChain()

  return screenId === 'connected' ? (
    <AccountConnectedButton onClick={toggle} />
  ) : isSupportedNetwork === false ? (
    <WrongNetworkButton compact={compact} />
  ) : (
    <Button
      icon={<IconConnect />}
      label="Enable account"
      onClick={toggle}
      display={compact ? 'icon' : 'all'}
    />
  )
}

export default HeaderButtons
