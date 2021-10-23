import React, { useCallback, useEffect } from 'react'

import { useWallet } from '@providers/Wallet'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import ScreenProviders from '@components/Account/ScreenProviders'

function ScreenProvidersWrapper({ onError, onSuccess }) {
  const wallet = useWallet()
  const { next } = useMultiModal()
  const { error } = wallet

  const activate = useCallback(
    async providerId => {
      try {
        await wallet.activate(providerId)
      } catch (error) {
        console.log('error ', error)
      }
    },
    [wallet]
  )

  useEffect(() => {
    if (error) {
      onError(error)
      return next()
    }
    if (wallet.account) {
      return onSuccess(true)
    }
  }, [error, next, onError, onSuccess, wallet])

  return <ScreenProviders onActivate={activate} />
}

export default ScreenProvidersWrapper
