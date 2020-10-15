import React, { useRef } from 'react'
import { BIG_RADIUS, Button, GU, useTheme } from '@1hive/1hive-ui'
import EmptyResults from './EmptyResults'
import ProposalCard from './ProposalCard'
import ProposalRankings from './ProposalRankings'
import { useLayout } from '../Layout'

import filterToggleSvg from '../../assets/filter.svg'

function ProposalsList({
  activeFilters,
  proposals,
  onProposalCountIncrease,
  onRankingFilterChange,
  onStakeToProposal,
  onToggleFilterSlider,
  onWithdrawFromProposal,
  rankingItems,
  selectedRanking,
}) {
  const listRef = useRef()

  const theme = useTheme()
  const { layoutName } = useLayout()
  const compact = layoutName === 'small'

  return (
    <div
      ref={listRef}
      css={`
        flex-grow: 1;
      `}
    >
      <div
        css={`
          margin: 0 ${(compact ? 1 : 0) * GU}px;
          position: sticky;
          top: 0;
          z-index: 3;
          padding-top: ${3 * GU}px;
          padding-bottom: ${0.5 * GU}px;
          background-color: ${theme.background};
        `}
      >
        <div
          css={`
            margin-bottom: ${1 * GU}px;
            display: flex;
            align-items: center;
          `}
        >
          {compact && <FilterToggle onToggle={onToggleFilterSlider} />}
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
                  onWithdrawFromProposal={onWithdrawFromProposal}
                />
              )
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

function FilterToggle({ onToggle }) {
  return (
    <Button
      icon={<img src={filterToggleSvg} />}
      display="icon"
      label=""
      onClick={onToggle}
      css={`
        margin-right: ${1 * GU}px;
        border-radius: ${BIG_RADIUS}px;
      `}
    />
  )
}

export default ProposalsList
