import React, { useCallback } from 'react'
import { GU, IdentityBadge, textStyle, useLayout } from '@1hive/1hive-ui'
import InfoField from '../../InfoField'
import ModalButton from '../ModalButton'
import { formatTokenAmount } from '../../../utils/token-utils'
import { useMultiModal } from '../../MultiModal/MultiModalProvider'

function SettlementDetails({ proposal, challengeContext, getTransactions }) {
  const { id, challenger, settlementOffer } = proposal
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
        By accepting this settlement offer you agree to cancel Proposal {id} and
        part of your action collateral will be slashed from your total staking
        balance.
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
        <InfoField label="Amount that will be slashed">
          {formatTokenAmount(settlementOffer, 18)} HNY
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
        Accept settlement
      </ModalButton>
    </div>
  )
}

export default SettlementDetails
