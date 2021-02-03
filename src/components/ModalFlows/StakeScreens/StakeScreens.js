import React, { useMemo } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import StakeAndWithdraw from './StakeAndWithdraw'
import { useAppState } from '../../../providers/AppState'
// import useActions from '../../../hooks/useActions'

function StakeScreens({ mode, stakeManagement }) {
  //   const actions = useActions()
  //   const [transactions, setTransactions] = useState([])
  //   const test = 1

  //   const getTransactions = useCallback(
  //     async onComplete => {
  //       await actions.agreementActions.signAgreement({ test }, intent => {
  //         setTransactions(intent.transactions)
  //         onComplete()
  //       })
  //     },
  //     [actions, test]
  //   )

  const { accountBalance } = useAppState()

  const data = useMemo(() => {
    if (mode === 'deposit') {
      return {
        title: 'Deposit HNY as collateral',
        transactionTitle: 'Deposit HNY',
      }
    }
    return { title: 'Withdraw HNY', transactionTitle: 'Withdraw HNY' }
  }, [mode])

  const screens = useMemo(
    () => [
      {
        title: data.title,
        content: (
          <StakeAndWithdraw
            mode={mode}
            accountBalance={accountBalance}
            stakeManagement={stakeManagement}
          />
        ),
      },
    ],
    [data.title, mode, accountBalance, stakeManagement]
  )
  return (
    <ModalFlowBase
      frontLoad={false}
      //   transactions={transactions}
      //   transactionTitle={data.transactionTitle}
      screens={screens}
    />
  )
}

export default StakeScreens
