import React, { useMemo, useState, useCallback } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import WrapUnwrap from './WrapUnwrap'

import { useAppState } from '../../../providers/AppState'

import useActions from '../../../hooks/useActions'

function WrapTokenScreens({ mode }) {
  const [transactions, setTransactions] = useState([])
  const {
    accountBalance: gardenTokenBalance,
    stakeToken,
    wrappableAccountBalance,
    wrappableToken,
  } = useAppState()
  const { hookedTokenManagerActions } = useActions()

  const getTransactions = useCallback(
    async (onComplete, amount) => {
      await hookedTokenManagerActions.wrap({ amount }, intent => {
        setTransactions(intent)
        onComplete()
      })
    },
    [hookedTokenManagerActions]
  )

  const title =
    mode === 'wrap'
      ? `Wrap ${wrappableToken.symbol} to receive ${stakeToken.symbol}`
      : `Unwrap ${stakeToken.symbol} to receive ${wrappableToken.symbol}`

  const screens = useMemo(() => {
    return [
      {
        title: title,
        graphicHeader: false,
        content: (
          <WrapUnwrap
            gardenToken={stakeToken}
            gardenTokenBalance={gardenTokenBalance}
            getTransactions={getTransactions}
            mode={mode}
            wrappableToken={wrappableToken}
            wrappableAccountBalance={wrappableAccountBalance}
          />
        ),
      },
    ]
  }, [
    gardenTokenBalance,
    getTransactions,
    mode,
    stakeToken,
    title,
    wrappableToken,
    wrappableAccountBalance,
  ])

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle={mode === 'wrap' ? 'Wrap token' : 'Unwrap token'}
      screens={screens}
    />
  )
}

export default WrapTokenScreens
