import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  BIG_RADIUS,
  Button,
  GU,
  useLayout,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'
import EmptyResults from './EmptyResults'
import ProposalCard from './ProposalCard'
import ProposalRankings from './ProposalRankings'

import filterToggleSvg from '../../assets/filter.svg'

function ProposalsList({
  activeFilters,
  proposals,
  proposalsFetchedCount,
  proposalCountFilter,
  onProposalCountIncrease,
  onRankingFilterChange,
  onStakeToProposal,
  onToggleFilterSlider,
  onVoteOnDecision,
  onWithdrawFromProposal,
  rankingItems,
  selectedRanking,
}) {
  const [fetching, setFetching] = useState(false)
  const listRef = useRef()

  const theme = useTheme()
  const { below } = useViewport()
  const { layoutName } = useLayout()
  const compact = layoutName === 'small' || layoutName === 'medium'

  const handleFetchMoreProposals = useCallback(() => {
    setFetching(true)
    onProposalCountIncrease()
  }, [onProposalCountIncrease])

  useEffect(() => {
    if (fetching) {
      setFetching(false)
    }
  }, [proposals.length]) //eslint-disable-line

  return (
    <div
      ref={listRef}
      css={`
        flex-basis: auto;
        flex-grow: 1;
      `}
    >
      <div
        css={`
          top: -1px;
          z-index: 3;
          position: sticky;
          padding: ${2 * GU}px ${(below('medium') ? 1 : 0) * GU}px;
          background-color: ${theme.background};

          ${!compact && `padding-top: ${3 * GU}px;`}
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          {below('medium') && <FilterToggle onToggle={onToggleFilterSlider} />}
          <ProposalRankings
            items={rankingItems}
            onChange={onRankingFilterChange}
            selected={selectedRanking}
          />
        </div>
      </div>
      <div>
        {proposals.length ? (
          <>
            {proposals.map((proposal, index) => {
              return (
                <ProposalCard
                  key={index}
                  proposal={proposal}
                  onStakeToProposal={onStakeToProposal}
                  onVoteOnDecision={onVoteOnDecision}
                  onWithdrawFromProposal={onWithdrawFromProposal}
                />
              )
            })}
            {(proposalsFetchedCount === proposalCountFilter ||
              (proposalsFetchedCount < proposalCountFilter && fetching)) && (
              <div
                css={`
                  width: 100%;
                  text-align: center;
                  margin-top: ${6 * GU}px;
                  margin-bottom: ${3 * GU}px;
                `}
              >
                <Button
                  label={fetching ? 'Loading…' : 'Load more'}
                  onClick={handleFetchMoreProposals}
                  disabled={fetching}
                />
              </div>
            )}
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

function FilterToggle({ onToggle }) {
  return (
    <Button
      icon={<img src={filterToggleSvg} />}
      display="icon"
      label="filter"
      onClick={onToggle}
      css={`
        margin-right: ${1 * GU}px;
        border-radius: ${BIG_RADIUS}px;
      `}
    />
  )
}

export default ProposalsList
