import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import { Button } from '@1hive/1hive-ui'
import ModalFlowBase from '../ModalFlowBase'
import StakeAndWithdraw from './StakeAndWithdraw'

import BigNumber from '@lib/bigNumber'
import { buildGardenPath } from '@utils/routing-utils'
import { toDecimals } from '@utils/math-utils'

const ZERO_BN = new BigNumber(toDecimals('0', 18))

function StakeScreens({ mode, stakeManagement, stakeActions }) {
  const [transactions, setTransactions] = useState([])
  const history = useHistory()
  const { allowance: stakingAllowance } = stakeManagement?.staking || {}
  const { token, accountBalance } = stakeManagement

  const temporatyTrx = useRef([])

  const handleCreateProposal = useCallback(() => {
    const path = buildGardenPath(history.location, 'create')
    history.push(path)
  }, [history])

  const renderOnCompleteActions = useCallback(() => {
    if (mode === 'deposit') {
      return (
        <Button
          label="Create proposal"
          mode="strong"
          onClick={handleCreateProposal}
          wide
        />
      )
    }
    return null
  }, [handleCreateProposal, mode])

  const getTransactions = useCallback(
    async (onComplete, amount) => {
      if (mode === 'deposit') {
        const allowance = await stakeActions.getAllowance()
        if (allowance.lt(amount)) {
          if (!allowance.eq(0)) {
            await stakeActions.approveTokenAmount(ZERO_BN, intent => {
              temporatyTrx.current = temporatyTrx.current.concat(intent)
            })
          }
          await stakeActions.approveTokenAmount(amount, intent => {
            temporatyTrx.current = temporatyTrx.current.concat(intent)
          })
        }

        await stakeActions.stake({ amount }, intent => {
          temporatyTrx.current = temporatyTrx.current.concat(intent)
        })

        if (stakingAllowance?.eq(0)) {
          await stakeActions.allowManager(intent => {
            temporatyTrx.current = temporatyTrx.current.concat(intent)
          })
        }

        setTransactions(temporatyTrx.current)
        onComplete()

        return
      }

      if (mode === 'withdraw') {
        await stakeActions.withdraw({ amount }, intent => {
          setTransactions(intent)
          onComplete()
        })
        return
      }
      setTransactions([])
    },
    [stakingAllowance, stakeActions, mode]
  )

  const data = useMemo(() => {
    if (mode === 'deposit') {
      return {
        title: `Add funds (${token.symbol}) to Deposit Manager`,
        transactionTitle: `Deposit ${token.symbol}`,
      }
    }
    return {
      title: `Withdraw ${token.symbol}`,
      transactionTitle: `Withdraw ${token.symbol}`,
    }
  }, [mode, token.symbol])

  const screens = useMemo(
    () => [
      {
        title: data.title,
        content: (
          <StakeAndWithdraw
            mode={mode}
            accountBalance={accountBalance}
            stakeManagement={stakeManagement}
            getTransactions={getTransactions}
          />
        ),
      },
    ],
    [data.title, mode, accountBalance, getTransactions, stakeManagement]
  )

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle={
        mode === 'deposit'
          ? `Deposit ${token.symbol}`
          : `Withdraw ${token.symbol}`
      }
      screens={screens}
      onCompleteActions={renderOnCompleteActions}
    />
  )
}

export default StakeScreens
