import React, { useCallback } from 'react'
import { GU, textStyle, useLayout } from '@1hive/1hive-ui'
import IdentityBadge from '@components/IdentityBadge'
import InfoField from '../../InfoField'
import ModalButton from '../ModalButton'
import { formatTokenAmount } from '@utils/token-utils'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import useChallenge from '@hooks/useChallenge'

function SettlementDetails({ getTransactions, isChallenger, proposal }) {
  const { id, challenger, collateralRequirement, settlementOffer } = proposal
  const { layoutName } = useLayout()
  const { next } = useMultiModal()
  const { challenge, loading } = useChallenge(proposal)
  
  // Check if this is an expired challenge settlement
  const isExpiredChallenge = 
    isChallenger && 
    proposal.status === 'Challenged' && 
    Date.now() > proposal.challengeEndDate &&
    proposal.settledAt === 0

  const handleOnContinue = useCallback(() => {
    getTransactions(() => {
      next()
    })
  }, [next, getTransactions])

  return (
    <div
      css={`
        ${textStyle('body2')};
      `}
    >
      <span>
        {isChallenger
          ? isExpiredChallenge
            ? `The proposal creator did not respond to your challenge within the allowed time frame. 
               You can now claim your collateral, which will transfer the settlement offer amount from the proposer to you,
               return your challenge deposit, and refund your dispute fees.`
            : `This proposal has been cancelled as the submitter never responded to your settlement offer. 
               Claiming your deposit will transfer your settlement offer amount from the proposal submitter to you; your challenge deposit will be returned, and your dispute fees refunded.`
          : `By accepting this settlement offer you agree to cancel Proposal ${id}; you will forfeit your proposal deposit and the settlement will be taken from the available funds in your deposit manager.`}
      </span>

      <div
        css={`
          display: grid;
          grid-template-columns: ${layoutName !== 'small'
            ? 'auto auto'
            : 'auto'};
          grid-gap: ${2.5 * GU}px;
          margin-top: ${3 * GU}px;
        `}
      >
        <InfoField
          label={
            isChallenger
              ? 'Amount you will get from submitter'
              : 'Amount that will be slashed'
          }
        >
          {formatTokenAmount(settlementOffer, 18)}{' '}
          {collateralRequirement.tokenSymbol}
        </InfoField>

        <div
          css={`
            display: flex;
            justify-content: flex-end;
            width: 100%;
          `}
        >
          <InfoField label="Challenger">
            <IdentityBadge entity={challenger} />
          </InfoField>
        </div>
      </div>
      <InfoField
        label="Argument in favor of cancelling action"
        css={`
          margin-top: ${3 * GU}px;
        `}
      >
        {!loading && challenge.context}
      </InfoField>
      <ModalButton mode="strong" loading={false} onClick={handleOnContinue}>
        {isChallenger ? 'Claim collateral' : 'Accept settlement'}
      </ModalButton>
    </div>
  )
}

export default SettlementDetails
