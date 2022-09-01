import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Button } from '@1hive/1hive-ui'

import { useStakingState } from '@providers/Staking'
import { useWallet } from '@providers/Wallet'
import { useGardenState } from '@/providers/GardenState'
import { useConnectedGarden } from '@/providers/ConnectedGarden'

import { useContractReadOnly } from '@/hooks/useContract'
import useActions from '@hooks/useActions'
import { useAgreement } from '@hooks/useAgreement'
import { useMounted } from '@hooks/useMounted'

import { throwConfetti } from '@utils/confetti-utils'
import { fromDecimals } from '@utils/math-utils'
import { extractProposalId } from '@utils/proposal-utils'
import { buildGardenPath } from '@utils/routing-utils'

import convictionAbi from '@abis/conviction.json'

import { getAccountSetting } from '@/local-settings'

import ModalFlowBase from '../ModalFlowBase'
import ActionFees from './ActionFees'
import AddProposal from './AddProposal'
import CreateProposalRequirements from './CreateProposalRequirements'

function GoToProposal() {
  const history = useHistory()
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
    const path = buildGardenPath(history.location, `proposal/${proposalId}`)
    history.push(path)
  }, [history, proposalId])

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
  const { config } = useGardenState()
  const { chainId } = useConnectedGarden()

  const { stakeManagement, loading: stakingLoading } = useStakingState()
  const { convictionActions, fluidProposalsActions } = useActions()

  const convictionContract = useContractReadOnly(
    config.conviction.id,
    convictionAbi,
    chainId
  )

  const proposalData = useRef<any>()
  const temporatyTrx = useRef([])

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
      const { amount, beneficiary, link, title, proposalType } =
        proposalData.current

      const onDone = (txs: any) => {
        setTransactions(txs)
        onComplete()
      }

      if (proposalType === 0) {
        // SIGNALING_PROPOSAL
        await convictionActions.newSignalingProposal(
          {
            title,
            link,
          },
          onDone
        )
      } else if (proposalType === 3) {
        // STREAM_PROPOSAL
        if (convictionContract === null) return
        const proposalId = await convictionContract.proposalCounter()

        await convictionActions.newSignalingProposal(
          {
            title,
            link,
          },
          (intent: any) => {
            temporatyTrx.current = temporatyTrx.current.concat(intent)
          }
        )

        await fluidProposalsActions.activateProposal(
          {
            proposalId,
            beneficiary,
          },
          (intent: any) => {
            const trxList = temporatyTrx.current.concat(intent)
            setTransactions(trxList)
            onComplete()
          }
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
