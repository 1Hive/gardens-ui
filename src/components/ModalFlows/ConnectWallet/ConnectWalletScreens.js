import React, { useCallback, useMemo, useState } from 'react'
// import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

import ModalFlowBase from '../../Garden/ModalFlows/ModalFlowBase'
import ConnectWallet from './ConnectWallet'
import ScreenProvidersWrapper from './ScreenProvidersWrapper'
import ScreenError from '@components/Account/ScreenError'

function ConectWalletScreens({ onSuccess }) {
  // console.log('WALLET ', wallet)
  // const handleCancelConnection = useCallback(() => {
  //   wallet.reset()
  // }, [wallet])
  const [error, setError] = useState(null)
  const handleOnError = useCallback(e => {
    setError(e)
  }, [])

  const screens = useMemo(() => {
    return [
      {
        graphicHeader: false,
        content: <ConnectWallet />,
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
        content: <ScreenError error={error} onBack={() => {}} />,
        width: 550,
      },
    ]
  }, [error, handleOnError, onSuccess])

  return <ModalFlowBase frontLoad={false} screens={screens} />
}

export default ConectWalletScreens
