import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { textStyle, useTheme } from '@1hive/1hive-ui'
import { ThumbsDownIcon, ThumbsUpIcon } from '../Icons'

import { useGardenState } from '@providers/GardenState'
import { useWallet } from '@providers/Wallet'

import { getStatusAttributes } from '../DecisionDetail/VoteStatus'
import { VOTE_NAY, VOTE_YEA } from '@/constants'
import { ProposalTypes } from '@/types'
import { formatTokenAmount } from '@utils/token-utils'
import { getConnectedAccountCast } from '../../../utils/vote-utils'
import { ProposalType } from '@/hooks/constants'
import ModalSupporters from './ProposalCardModalSupporters'

type ProposalCardFooterProps = {
  proposal: ProposalType
  onSelectProposal: () => void
}

function ProposalCardFooter({
  proposal,
  onSelectProposal,
}: ProposalCardFooterProps) {
  if (proposal.type === ProposalTypes.Decision) {
    return (
      <DecisionFooter proposal={proposal} onSelectProposal={onSelectProposal} />
    )
  }

  return (
    <ProposalFooter proposal={proposal} onSelectProposal={onSelectProposal} />
  )
}

type ProposalFooterProps = {
  proposal: ProposalType
  onSelectProposal: () => void
}

function ProposalFooter({ proposal, onSelectProposal }: ProposalFooterProps) {
  const { config } = useGardenState()
  const { stakeToken } = config.conviction
  const theme = useTheme()
  const [showSupportersModal, setShowSupportersModal] = useState(false)

  const supportersCount = useMemo(
    () => proposal.stakes.filter(({ amount }) => amount.gt(0)).length,
    [proposal]
  )

  const formattedNeededTokens = formatTokenAmount(
    proposal.neededTokens,
    stakeToken.decimals
  )

  // TODO: Use mapping and status symbol
  const proposalStatusLabel = useMemo(() => {
    if (proposal.statusData.open) {
      return 'Open'
    }

    if (proposal.statusData.rejected) {
      return 'Rejected'
    }

    if (proposal.statusData.cancelled) {
      return 'Cancelled'
    }

    if (proposal.statusData.settled) {
      return 'Settled'
    }

    if (proposal.statusData.challenged) {
      return 'Challenged'
    }

    if (proposal.statusData.disputed) {
      return 'Waiting for celeste'
    }

    return 'Closed'
  }, [proposal.statusData])

  return (
    <Main color={theme.contentSecondary}>
      <div>
        <span
          onClick={() => setShowSupportersModal(true)}
          style={{ cursor: 'pointer' }}
        >
          {supportersCount} Supporter{supportersCount === 1 ? '' : 's'}
        </span>
        <ModalSupporters
          proposal={proposal}
          visible={showSupportersModal}
          onClose={() => setShowSupportersModal(false)}
        />
      </div>
      {proposal.type === ProposalTypes.Proposal &&
        Number(proposal.neededTokens) > 0 && (
          <div>
            {stakeToken.symbol} needed to pass: {formattedNeededTokens}
          </div>
        )}
      <div onClick={onSelectProposal} style={{ cursor: 'pointer' }}>
        Status: {proposalStatusLabel}
      </div>
    </Main>
  )
}

type DecisionFooterProps = {
  proposal: ProposalType
  onSelectProposal: () => void
}

function DecisionFooter({ proposal, onSelectProposal }: DecisionFooterProps) {
  const theme = useTheme()
  const { account } = useWallet()
  const StatusAttributes = getStatusAttributes(proposal, theme)

  const votesCount = proposal.casts.length

  return (
    <Main color={theme.contentSecondary}>
      <div
        css={`
          display: flex;
          align-items: center;
        `}
      >
        {account && <SupportIndicator account={account} vote={proposal} />}
        <div>
          {votesCount} Vote{votesCount === 1 ? '' : 's'}
        </div>
      </div>
      <div onClick={onSelectProposal} style={{ cursor: 'pointer' }}>
        Status: {StatusAttributes?.label}
      </div>
    </Main>
  )
}

type SupportIndicatorProps = {
  account: string
  vote: unknown // TODO: Fix this when migrating vote-utils.js to ts
}

function SupportIndicator({ account, vote }: SupportIndicatorProps) {
  const accountCast = getConnectedAccountCast(vote, account)

  if (accountCast.vote === VOTE_YEA) {
    return <ThumbsUpIcon disabled={false} />
  } else if (accountCast.vote === VOTE_NAY) {
    return <ThumbsDownIcon disabled={false} />
  }

  return null
}

const Main = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;d

  color: ${({ color }) => color};
  ${textStyle('body3')};
`

export default ProposalCardFooter
