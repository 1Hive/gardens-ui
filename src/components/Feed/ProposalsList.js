import React, { useRef } from 'react'
import {
  BIG_RADIUS,
  Button,
  GU,
  useTheme,
  useLayout,
  useViewport,
} from '@1hive/1hive-ui'
import EmptyResults from './EmptyResults'
import ProposalCard from './ProposalCard'
import ProposalRankings from './ProposalRankings'

import filterToggleSvg from '../../assets/filter.svg'

function ProposalsList({
  activeFilters,
  proposals,
  proposalCount,
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
  const { below } = useViewport()
  const { layoutName } = useLayout()
  const compact = layoutName === 'small' || layoutName === 'medium'

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
          padding: ${2 * GU}px 0;
          margin: 0 ${(below('medium') ? 1 : 0) * GU}px;
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
                  onWithdrawFromProposal={onWithdrawFromProposal}
                />
              )
            })}
            {proposals.length === proposalCount && (
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
