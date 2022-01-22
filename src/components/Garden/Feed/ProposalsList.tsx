import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  BIG_RADIUS,
  Button,
  GU,
  useLayout,
  useTheme,
  useViewport,
} from '@1hive/1hive-ui'

import noProposalsYetLogo from '@assets/noProposalsYet.svg'
import EmptyResults from '../../EmptyResults'
import ProposalCard from './ProposalCard'
import ProposalRankings from './ProposalRankings'

import filterToggleSvg from '@assets/filter.svg'
import { ProposalType } from '@/hooks/constants'
import AbstainCard from './AbstainCard'

type ProposalsListProps = {
  activeFilters: boolean
  proposals: Array<ProposalType>
  proposalsFetchedCount: number
  proposalCountFilter: number
  onProposalCountIncrease: () => void
  onRankingFilterChange: () => void
  onToggleFilterSlider: () => void
  rankingItems: Array<any>
  selectedRanking: number
}

function ProposalsList({
  activeFilters,
  proposals,
  proposalsFetchedCount,
  proposalCountFilter,
  onProposalCountIncrease,
  onRankingFilterChange,
  onToggleFilterSlider,
  rankingItems,
  selectedRanking,
}: ProposalsListProps) {
  const [fetching, setFetching] = useState(false)
  const listRef = useRef<any>()

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

  // TODO: Need to be discussed
  const Card = (proposal: ProposalType) =>
    proposal.metadata === 'Abstain proposal' ? (
      <AbstainCard proposal={proposal} />
    ) : (
      <ProposalCard proposal={proposal} />
    )

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
            {proposals.map((proposal, index) => (
              <Fragment key={index}>{Card(proposal)}</Fragment>
            ))}
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
            image={noProposalsYetLogo}
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

type FilterToggleProps = {
  onToggle: () => void
}

function FilterToggle({ onToggle }: FilterToggleProps) {
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
