import React, { useCallback, useMemo, useRef, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import WrapUnwrap from './WrapUnwrap'

import { useAppState } from '../../../providers/AppState'
import useActions from '../../../hooks/useActions'

import BigNumber from '../../../lib/bigNumber'
import { toDecimals } from '../../../utils/math-utils'

const ZERO_BN = new BigNumber(toDecimals('0', 18))

function WrapTokenScreens({ mode }) {
  const [transactions, setTransactions] = useState([])
  const {
    accountBalance: gardenTokenBalance,
    stakeToken,
    wrappableAccountBalance,
    wrappableToken,
  } = useAppState()
  const { hookedTokenManagerActions } = useActions()

  const temporatyTrx = useRef([])

  const getTransactions = useCallback(
    async (onComplete, amount) => {
      if (mode === 'wrap') {
        const allowance = await hookedTokenManagerActions.getAllowance()
        if (allowance.lt(amount)) {
          if (!allowance.eq(0)) {
            await hookedTokenManagerActions.approveWrappableTokenAmount(
              ZERO_BN,
              intent => {
                temporatyTrx.current = temporatyTrx.current.concat(intent)
              }
            )
          }
          await hookedTokenManagerActions.approveWrappableTokenAmount(
            amount,
            intent => {
              temporatyTrx.current = temporatyTrx.current.concat(intent)
            }
          )
        }
        await hookedTokenManagerActions.wrap({ amount }, intent => {
          temporatyTrx.current = temporatyTrx.current.concat(intent)
        })
        setTransactions(temporatyTrx.current)
        onComplete()
      }
      if (mode === 'unwrap') {
        await hookedTokenManagerActions.unwrap({ amount }, intent => {
          setTransactions(intent)
          onComplete()
        })
      }
    },
    [hookedTokenManagerActions, mode]
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
