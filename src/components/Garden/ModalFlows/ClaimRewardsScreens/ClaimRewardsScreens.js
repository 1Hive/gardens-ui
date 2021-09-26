import React, { useCallback, useMemo, useState } from 'react'
import ClaimRewards from './ClaimRewards'
import ModalFlowBase from '../ModalFlowBase'

function ClaimRewardsScreens({ unipoolActions }) {
  const [transactions, setTransactions] = useState([])

  const getTransactions = useCallback(
    async onComplete => {
      await unipoolActions.claimRewards(intent => {
        setTransactions(intent)
        onComplete()
      })
    },
    [unipoolActions]
  )

  const screens = useMemo(() => {
    return [
      {
        title: 'Claim rewards',
        graphicHeader: false,
        content: <ClaimRewards getTransactions={getTransactions} />,
      },
    ]
  }, [getTransactions])

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Claim rewards"
      screens={screens}
    />
  )
}

export default ClaimRewardsScreens
