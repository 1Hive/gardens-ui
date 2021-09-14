import React, { useCallback } from 'react'
import { GU, IdentityBadge, textStyle, useLayout } from '@1hive/1hive-ui'
import InfoField from '../../InfoField'
import ModalButton from '../ModalButton'
import { formatTokenAmount } from '@utils/token-utils'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

function SettlementDetails({
  challengeContext,
  getTransactions,
  isChallenger,
  proposal,
}) {
  const { id, challenger, collateralRequirement, settlementOffer } = proposal
  const { layoutName } = useLayout()
  const { next } = useMultiModal()

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
          ? `This proposal has been cancelled as the submitter never responded to your settlement offer. 
          Claiming your deposit will transfer your settlement offer amount from the proposal submitter to you; your challenge deposit will be returned, and your dispute fees refunded.`
          : `By accepting this settlement offer you agree to cancel Proposal ${id}; the settlement amount will be taken from your proposal deposit.`}
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
        {challengeContext}
      </InfoField>
      <ModalButton mode="strong" loading={false} onClick={handleOnContinue}>
        {isChallenger ? 'Claim deposit' : 'Accept settlement'}
      </ModalButton>
    </div>
  )
}

export default SettlementDetails
