import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useWallet } from 'use-wallet'
import { Button, GU, IconConnect } from '@1hive/1hive-ui'

import ScreenError from './ScreenError'
import AccountButton from './AccountButton'
import ScreenProviders from './ScreenProviders'
import ScreenConnected from './ScreenConnected'
import ScreenConnecting from './ScreenConnecting'
import HeaderPopover from '../Header/HeaderPopover'

import { useProfile } from '../../providers/Profile'

const SCREENS = [
  {
    id: 'providers',
  },
  {
    id: 'connecting',
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

  const wallet = useWallet()
  const [opened, setOpened] = useState(false)
  const [activatingDelayed, setActivatingDelayed] = useState(false)
  const [activationError, setActivationError] = useState(null)

  const { boxOpened } = useProfile()
  const { account, activating } = wallet

  const clearError = useCallback(() => setActivationError(null), [])
  const toggle = useCallback(() => setOpened(opened => !opened), [])

  const handleCancelConnection = useCallback(() => {
    wallet.deactivate()
  }, [wallet])

  const activate = useCallback(
    async providerId => {
      try {
        await wallet.activate(providerId)
      } catch (error) {
        setActivationError(error)
      }
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
    if (activationError) {
      setActivatingDelayed(null)
    }

    if (activating) {
      setActivatingDelayed(activating)
      return
    }

    const timer = setTimeout(() => {
      setActivatingDelayed(null)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [activating, activationError])

  const previousScreenIndex = useRef(-1)

  const { direction, screenIndex } = useMemo(() => {
    const screenId = (() => {
      if (activationError) return 'error'
      if (activatingDelayed) return 'connecting'
      if (account) return 'connected'
      return 'providers'
    })()

    const screenIndex = SCREENS.findIndex(screen => screen.id === screenId)
    const direction = previousScreenIndex.current > screenIndex ? -1 : 1

    previousScreenIndex.current = screenIndex

    return { direction, screenIndex }
  }, [account, activationError, activatingDelayed])

  const screen = SCREENS[screenIndex]
  const screenId = screen.id

  const handlePopoverClose = useCallback(
    reject => {
      if (screenId === 'connecting' || screenId === 'error') {
        // reject closing the popover
        return false
      }
      setOpened(false)
      setActivationError(null)
    },
    [screenId]
  )

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
      {screen.id === 'connected' ? (
        <AccountButton onClick={toggle} />
      ) : (
        <Button
          icon={<IconConnect />}
          label="Enable account"
          onClick={toggle}
          display={compact ? 'icon' : 'all'}
          // disabled={isLoading}
        />
      )}
      <HeaderPopover
        direction={direction}
        heading={screen.title}
        onClose={handlePopoverClose}
        opener={buttonRef.current}
        screenId={screenId}
        screenData={{
          account,
          activating: activatingDelayed,
          activationError,
          status,
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
                providerId={activating}
                onCancel={handleCancelConnection}
              />
            )
          }
          if (screenId === 'connected') {
            return (
              <ScreenConnected
                onClosePopover={handlePopoverClose}
                wallet={wallet}
              />
            )
          }
          if (screenId === 'error') {
            return <ScreenError error={activationError} onBack={clearError} />
          }
          return <ScreenProviders onActivate={activate} />
        }}
      </HeaderPopover>
    </div>
  )
}

export default AccountModule
