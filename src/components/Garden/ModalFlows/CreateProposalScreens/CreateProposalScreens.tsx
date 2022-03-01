import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { Button } from '@1hive/1hive-ui'

import { useStakingState } from '@providers/Staking'
import { useWallet } from '@providers/Wallet'

import useActions from '@hooks/useActions'
import { useAgreement } from '@hooks/useAgreement'
import { useMounted } from '@hooks/useMounted'

import { throwConfetti } from '@utils/confetti-utils'
import { fromDecimals } from '@utils/math-utils'
import { extractProposalId } from '@utils/proposal-utils'
import { buildGardenPath } from '@utils/routing-utils'

import { getAccountSetting } from '@/local-settings'

import ModalFlowBase from '../ModalFlowBase'
import ActionFees from './ActionFees'
import AddProposal from './AddProposal'
import CreateProposalRequirements from './CreateProposalRequirements'

function GoToProposal() {
  const router = useRouter()
  const [proposalId, setProposalId] = useState<string>()
  const { account, chainId, ethers } = useWallet()
  const mounted = useMounted()
  const txHash = getAccountSetting('lastTxHash', account, chainId)

  useEffect(() => {
    async function getProposalId() {
      const id = await extractProposalId(ethers, txHash, 'conviction')

      if (mounted()) {
        setProposalId(fromDecimals(id.toString(), 18))
      }
    }
    getProposalId()
  }, [extractProposalId, ethers, txHash])

  const handleGoToProposal = useCallback(() => {
    const path = buildGardenPath(router, `proposal/${proposalId}`)
    router.push(path)
  }, [router, proposalId])

  return (
    <Button
      label="Go to proposal"
      mode="strong"
      onClick={handleGoToProposal}
      wide
    />
  )
}

function CreateProposalScreens({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const { account } = useWallet()
  const [agreement, agreementLoading] = useAgreement()
  const { stakeManagement, loading: stakingLoading } = useStakingState()
  const { convictionActions } = useActions()

  const proposalData = useRef<any>()

  useEffect(() => {
    setLoading(true)
    setTransactions([])
    proposalData.current = null
  }, [account])

  useEffect(() => {
    setLoading(agreementLoading || stakingLoading)
  }, [agreementLoading, stakingLoading])

  const handleSetProposalData = (data: any) => {
    proposalData.current = data
  }

  const onCompleteMiddleware = useCallback(() => {
    throwConfetti({
      x: 0.5,
      y: 0.7,
    })
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  const getTransactions = useCallback(
    async (onComplete) => {
      const { amount, beneficiary, link, title } = proposalData.current

      const onDone = (intent: any) => {
        setTransactions(intent)
        onComplete()
      }

      if (amount.valueBN.eq(0)) {
        await convictionActions.newSignalingProposal(
          {
            title,
            link,
          },
          onDone
        )
      } else {
        const convertedAmount = amount.valueBN.toString(10)
        const stableRequestAmount = amount.stable

        await convictionActions.newProposal(
          {
            title,
            link,
            amount: convertedAmount,
            stableRequestAmount,
            beneficiary,
          },
          onDone
        )
      }
    },
    [convictionActions, proposalData]
  )

  const screens = useMemo(
    () =>
      stakingLoading
        ? []
        : [
            {
              title: 'Create proposal requirements',
              graphicHeader: false,
              content: (
                <CreateProposalRequirements
                  agreement={agreement}
                  staking={stakeManagement.staking}
                />
              ),
            },
            {
              title: 'Create proposal',
              graphicHeader: true,
              content: <AddProposal setProposalData={handleSetProposalData} />,
            },
            {
              title: 'Proposal deposit',
              graphicHeader: false,
              content: (
                <ActionFees
                  agreement={agreement}
                  onCreateTransaction={getTransactions}
                />
              ),
            },
          ],
    [
      agreement,
      getTransactions,
      handleSetProposalData,
      stakingLoading,
      stakeManagement,
    ]
  )

  return (
    <ModalFlowBase
      frontLoad
      loading={loading}
      transactions={transactions}
      transactionTitle="Create proposal"
      screens={screens}
      onComplete={onCompleteMiddleware}
      onCompleteActions={<GoToProposal />}
    />
  )
}

export default CreateProposalScreens
