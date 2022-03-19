import React, { useCallback, useMemo, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import PriceOracle from './PriceOracle'
import useActions from '@hooks/useActions'

function PriceOracleScreens() {
  const [transactions, setTransactions] = useState([])
  const { priceOracleActions } = useActions()

  const getTransactions = useCallback(
    async onComplete => {
      await priceOracleActions.updatePriceOracle(intent => {
        setTransactions(intent)
        onComplete()
      })
    },
    [priceOracleActions]
  )

  const screens = useMemo(
    () => [
      {
        title: 'Update Price Oracle',
        graphicHeader: true,
        content: <PriceOracle getTransactions={getTransactions} />,
      },
    ],
    [getTransactions]
  )

  return (
    <ModalFlowBase
      frontLoad={false}
      transactions={transactions}
      transactionTitle="Update Price Oracle"
      screens={screens}
    />
  )
}

export default PriceOracleScreens
