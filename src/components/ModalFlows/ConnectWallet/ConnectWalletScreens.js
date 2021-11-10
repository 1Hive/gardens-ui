import React, { useCallback, useMemo, useState } from 'react'

import ModalFlowBase from '../../Garden/ModalFlows/ModalFlowBase'
import ConnectWallet from './ConnectWallet'
import ScreenProvidersWrapper from './ScreenProvidersWrapper'
import ScreenError from '@components/Account/ScreenError'

function ConectWalletScreens({ onSuccess }) {
  const [error, setError] = useState(null)
  const handleOnError = useCallback(e => {
    setError(e)
  }, [])

  console.log('error ', error)

  const screens = useMemo(() => {
    return [
      {
        graphicHeader: false,
        content: <ConnectWallet onDismiss={onSuccess} />,
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
