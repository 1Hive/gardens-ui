import React, { useCallback, useEffect, useMemo, useState } from 'react'
import ModalFlowBase from '../ModalFlowBase'
import ActionFees from './ActionFees'
import CreateDecisionRequirements from './CreateDecisionRequirements'
import { useAgreement } from '@hooks/useAgreement'
import { useWallet } from '@providers/Wallet'
// import useActions from '@hooks/useActions'
import { useStakingState } from '@providers/Staking'

function CreateDecisionScreens({ onComplete, onCreateTransaction }) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const { account } = useWallet()
  const [agreement, agreementLoading] = useAgreement()
  const { stakeManagement, loading: stakingLoading } = useStakingState()
  // const { convictionActions } = useActions()

  useEffect(() => {
    setLoading(true)
    setTransactions([])
  }, [account])

  useEffect(() => {
    setLoading(agreementLoading || stakingLoading)
  }, [agreementLoading, stakingLoading])

  const getTransactions = useCallback(
    async onComplete => {
      const intent = await onCreateTransaction()
      setTransactions(intent)
      onComplete()
    },
    [onCreateTransaction]
  )

  const screens = useMemo(
    () =>
      stakingLoading
        ? []
        : [
            {
              title: 'Create decision requirements',
              graphicHeader: false,
              content: (
                <CreateDecisionRequirements
                  agreement={agreement}
                  staking={stakeManagement.staking}
                />
              ),
            },
            {
              title: 'Decision deposit',
              graphicHeader: false,
              content: (
                <ActionFees
                  agreement={agreement}
                  onCreateTransaction={getTransactions}
                />
              ),
            },
          ],
    [agreement, getTransactions, stakingLoading, stakeManagement]
  )

  return (
    <ModalFlowBase
      frontLoad
      loading={loading}
      transactions={transactions}
      transactionTitle="Create decision"
      screens={screens}
      onComplete={onComplete}
    />
  )
}

export default CreateDecisionScreens
