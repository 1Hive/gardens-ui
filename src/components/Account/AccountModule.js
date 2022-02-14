import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  ButtonBase,
  GU,
  IconConnect,
  IconCanvas,
} from '@1hive/1hive-ui'
import { useWallet } from '@providers/Wallet'

import AccountButton from './AccountButton'
import ScreenProviders from './ScreenProviders'
import ScreenConnected from './ScreenConnected'
import ScreenConnecting from './ScreenConnecting'
import ScreenPromptingAction from './ScreenPromptingAction'
import HeaderPopover from '../Header/HeaderPopover'
import { switchNetwork } from '@/networks'

const SCREENS = [
  {
    id: 'providers',
  },
  {
    id: 'connecting',
  },
  {
    id: 'networks',
  },
  {
    id: 'connected',
  },
  {
    id: 'error',
  },
]

function AccountModule({ compact }) {
  const buttonRef = useRef()

  const {
    account,
    activating,
    connect,
    connector,
    error,
    resetConnection,
    switchingNetworks,
    isSupportedNetwork,
  } = useWallet()

  const [opened, setOpened] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(false)

  const toggle = useCallback(() => setOpened((opened) => !opened), [])

  const activate = async (providerId) => {
    try {
      await connect(providerId)
    } catch (error) {
      console.log('error ', error)
    }
  }

  const previousScreenIndex = useRef(-1)

  const { direction, screenIndex } = useMemo(() => {
    const screenId = (() => {
      if (error) return 'error'
      if (activatingDelayed) return 'connecting'
      if (switchingNetworks) return 'networks'
      if (account) return 'connected'
      return 'providers'
    })()

    const screenIndex = SCREENS.findIndex((screen) => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [activatingDelayed, account, error, switchingNetworks])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id
  const isWrongNetwork = isSupportedNetwork === false

  console.log(`isWrongNetwork`, isWrongNetwork)

  const handlePopoverClose = useCallback(
    (reject) => {
      if (
        screenId === 'connecting' ||
        screenId === 'error' ||
        screenId === 'networks'
      ) {
        // reject closing the popover
        return false
      }
      setOpened(false)
    },
    [screenId]
  )

  useEffect(() => {
    if (screenId === 'networks') {
      setOpened(true)
    }

    if (screenId === 'error' || isWrongNetwork === false) {
      setOpened(false)
    }
  }, [screenId, isWrongNetwork])

  const HeaderButton = () => {
    return screen.id === 'connected' ? (
      <AccountButton onClick={toggle} />
    ) : isWrongNetwork ? (
      <>
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
      </>
    ) : (
      <Button
        icon={<IconConnect />}
        label="Enable account"
        onClick={toggle}
        display={compact ? 'icon' : 'all'}
      />
    )
  }

  return (
    <div
      ref={buttonRef}
      tabIndex="0"
      css={`
        display: flex;
        align-items: center;
        justify-content: space-around;
        outline: 0;
      `}
    >
      <HeaderButton />
      <HeaderPopover
        direction={direction}
        heading={screen.title}
        onClose={handlePopoverClose}
        opener={buttonRef.current}
        screenId={screenId}
        screenData={{
          account,
          activating: activatingDelayed,
          activationError: error,
          screenId,
        }}
        screenKey={({ account, activating, activationError, screenId }) =>
          (activationError ? activationError.name : '') +
          account +
          activating +
          screenId
        }
        visible={opened}
        width={(screen.id === 'connected' ? 41 : 51) * GU}
      >
        {({ activating, activationError, screenId }) => {
          if (screenId === 'connecting') {
            return (
              <ScreenConnecting
                providerId={connector}
                onCancel={resetConnection}
              />
            )
          }
          if (screenId === 'connected') {
            return (
              <ScreenConnected
                providerId={connector}
                onClosePopover={handlePopoverClose}
              />
            )
          }
          if (screen.id === 'networks') {
            return <ScreenPromptingAction />
          }
          return <ScreenProviders onActivate={activate} />
        }}
      </HeaderPopover>
    </div>
  )
}

export default AccountModule
