import React, { useMemo } from 'react'

import ConnectWallet from './ConnectWallet'
import ScreenProvidersWrapper from './ScreenProvidersWrapper'
import MultiModalScreens from '@/components/MultiModal/MultiModalScreens'
import useWalletError from '@/hooks/useWalletError'

type ConectWalletScreensProps = {
  onSuccess: () => void
  onClose: () => void
}

function ConectWalletScreens({ onSuccess, onClose }: ConectWalletScreensProps) {
  const { error, handleOnError, handleTryAgain } = useWalletError()

  console.log(`ConectWalletScreens`, error)

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
