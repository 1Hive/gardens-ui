import React, { useCallback, useMemo, useState } from 'react'

import ConnectWallet from './ConnectWallet'
import ScreenProvidersWrapper from './ScreenProvidersWrapper'
import MultiModalScreens from '@/components/MultiModal/MultiModalScreens'
import ScreenErrorWrapper from './ScreenErrorWrapper'
import { useWallet } from 'use-wallet'

function ConectWalletScreens({ onSuccess, onClose }) {
  const [error, setError] = useState(null)
  const wallet = useWallet()

  const handleOnError = useCallback(e => {
    setError(e)
  }, [])

  const handleTryAgain = useCallback(() => {
    wallet.reset()
    setError(null)
  }, [wallet])

  const screens = useMemo(() => {
    return [
      {
        graphicHeader: false,
        content: <ConnectWallet onDismiss={onClose} />,
        width: 550,
      },
      {
        graphicHeader: false,
        content: (
          <ScreenProvidersWrapper
            onSuccess={onSuccess}
            onError={handleOnError}
          />
        ),
        width: 550,
      },
      {
        graphicHeader: false,
        content: <ScreenErrorWrapper error={error} onBack={handleTryAgain} />,
        width: 550,
      },
    ]
  }, [error, handleOnError, handleTryAgain, onClose, onSuccess])

  const extendedScreens = useMemo(() => {
    const allScreens = []

    // Spread in our flow screens
    if (screens) {
      allScreens.push(...screens)
    }

    return allScreens
  }, [screens])

  return <MultiModalScreens screens={extendedScreens} />
}

export default ConectWalletScreens
