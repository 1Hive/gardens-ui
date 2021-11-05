import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, GU, IconConnect } from '@1hive/1hive-ui'

import ScreenError from './ScreenError'
import AccountButton from './AccountButton'
import ScreenProviders from './ScreenProviders'
import ScreenConnected from './ScreenConnected'
import ScreenConnecting from './ScreenConnecting'
import ScreenPromptingAction from './ScreenPromptingAction'
import HeaderPopover from '../Header/HeaderPopover'

import { useProfile } from '@/providers/Profile'
import { useWallet, WALLET_STATUS } from '@/providers/Wallet'
import { addEthereumChain } from '@/networks'

const SCREEN_ID = Object.freeze({
  providers: WALLET_STATUS.providers,
  network: WALLET_STATUS.network,
  connecting: WALLET_STATUS.connecting,
  connected: WALLET_STATUS.connected,
  error: WALLET_STATUS.error,
})

const SCREENS = [
  { id: SCREEN_ID.providers, title: 'Use account from' },
  { id: SCREEN_ID.network, title: 'Use account from' },
  { id: SCREEN_ID.connecting, title: 'Use account from' },
  { id: SCREEN_ID.connected, title: 'Active account' },
  { id: SCREEN_ID.error, title: 'Connection error' },
]

function AccountModule({ compact }) {
  const [opened, setOpened] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(false)
  const [creatingNetwork, setCreatingNetwork] = useState(false)
  const buttonRef = useRef()
  const wallet = useWallet()
  const { boxOpened } = useProfile()

  const { account, error, status, providerInfo } = wallet

  const open = useCallback(() => setOpened(true), [])
  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const handleResetConnection = useCallback(() => {
    wallet.reset()
  }, [wallet])

  const handleActivate = useCallback(
    async providerId => {
      setCreatingNetwork(true)
      await addEthereumChain()
      setCreatingNetwork(false)
      await wallet.connect(providerId)
    },
    [wallet]
  )

  useEffect(() => {
    if (account && boxOpened) {
      setOpened(false)
    }
  }, [account, boxOpened])

  // Always show the “connecting…” screen, even if there are no delay
  useEffect(() => {
    let timer

    if (status === WALLET_STATUS.error) {
      setActivatingDelayed(null)
    }

    if (status === WALLET_STATUS.connecting) {
      setActivatingDelayed(providerInfo.id)
      timer = setTimeout(() => {
        setActivatingDelayed(null)
      }, 400)
    }

    return () => clearTimeout(timer)
  }, [providerInfo, status])

  const previousScreenIndex = useRef(-1)

  const { screenIndex, direction } = useMemo(() => {
    const screenId =
      status === WALLET_STATUS.disconnected
        ? SCREEN_ID.providers
        : creatingNetwork
        ? SCREEN_ID.network
        : status

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [creatingNetwork, status])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const handlePopoverClose = useCallback(() => {
    if (screenId === SCREEN_ID.connecting || screenId === SCREEN_ID.error) {
      // reject closing the popover
      return false
    }
    setOpened(false)
  }, [screenId])

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
      {screenId === SCREEN_ID.connected ? (
        <AccountButton onClick={toggle} />
      ) : (
        <Button
          icon={<IconConnect />}
          label="Enable account"
          onClick={toggle}
          display={compact ? 'icon' : 'all'}
        />
      )}
      <HeaderPopover
        direction={direction}
        heading={screen.title}
        keys={({ screenId }) => screenId + providerInfo.id + error.name}
        onClose={handlePopoverClose}
        onOpen={open}
        opener={buttonRef.current}
        screenId={screenId}
        screenData={{
          account,
          activating: activatingDelayed,
          activationError: error,
          providerInfo,
          screenId,
        }}
        screenKey={({
          account,
          activating,
          activationError,
          providerInfo,
          screenId,
        }) =>
          (activationError ? activationError.name : '') +
          account +
          activating +
          providerInfo.id +
          screenId
        }
        visible={opened}
        width={(screen.id === 'connected' ? 41 : 51) * GU}
      >
        {({ account, screenId, activating, activationError, providerInfo }) => {
          if (screenId === SCREEN_ID.network) {
            return <ScreenPromptingAction />
          }
          if (screenId === SCREEN_ID.connecting) {
            return (
              <ScreenConnecting
                onCancel={handleResetConnection}
                wallet={wallet}
              />
            )
          }
          if (screenId === SCREEN_ID.connected) {
            return (
              <ScreenConnected
                onClosePopover={handlePopoverClose}
                wallet={wallet}
              />
            )
          }
          if (screenId === SCREEN_ID.error) {
            return (
              <ScreenError
                error={activationError}
                onBack={handleResetConnection}
              />
            )
          }
          return <ScreenProviders onActivate={handleActivate} />
        }}
      </HeaderPopover>
    </div>
  )
}

export default AccountModule
