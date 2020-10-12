import React, { useRef } from 'react'
import { Button, GU } from '@1hive/1hive-ui'
import EmptyResults from './EmptyResults'

function ProposalsList({
  activeFilters,
  proposals,
  onProposalCountIncrease,
  onRankingFilterChange,
  onStakeToProposal,
  onWithdrawFromProposal,
  rankingItems,
  selectedRanking,
}) {
  const listRef = useRef()

  return (
    <div
      ref={listRef}
      css={`
        flex-basis: 50%;
      `}
    >
      {/* TODO: ADD rankings */}
      <div>Proposal rankings</div>
      <div>
        {proposals.length ? (
          <>
            {proposals.map((proposal, index) => {
              return <div>Proposal # {proposal.id}</div>
            })}
            <div
              css={`
                width: 100%;
                text-align: center;
                margin-top: ${6 * GU}px;
                margin-bottom: ${3 * GU}px;
              `}
            >
              <Button label="Load more" onClick={onProposalCountIncrease} />
            </div>
          </>
        ) : (
          <EmptyResults
            title={activeFilters ? 'No results found' : 'No proposals yet!'}
            paragraph={
              activeFilters
                ? 'We couldn’t find any proposal matching your filter selection'
                : ''
            }
          />
        )}
      </div>
    </div>
  )
}

export default ProposalsList
