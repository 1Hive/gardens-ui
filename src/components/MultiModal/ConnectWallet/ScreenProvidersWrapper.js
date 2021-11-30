import React, { useCallback, useEffect } from 'react'
import { useWallet } from '@providers/Wallet'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

import ScreenProviders from '@components/Account/ScreenProviders'

function ScreenProvidersWrapper({ onError, onSuccess }) {
  const { account, connect, error } = useWallet()
  const { next } = useMultiModal()

  const activate = useCallback(
    async providerId => {
      try {
        await connect(providerId)
      } catch (error) {
        console.log('error ', error)
      }
    },
    [connect]
  )

  useEffect(() => {
    if (error) {
      onError(error)
      return next()
    }
    if (account) {
      return onSuccess()
    }
  }, [account, error, next, onError, onSuccess])

  return <ScreenProviders onActivate={activate} />
}

export default ScreenProvidersWrapper
