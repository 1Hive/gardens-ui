import React from 'react'
import { GU, SidePanel } from '@1hive/1hive-ui'

import AddProposalPanel from '../components/panels/AddProposalPanel'
import FilterSidebar from '../components/FilterSidebar/FilterSidebar'
import HeroBanner from '../components/Feed/HeroBanner'
import Loader from '../components/Loader'
import Metrics from '../components/Metrics'
import ProposalsList from '../components/Feed/ProposalsList'

import useAppLogic from '../logic/app-logic'

const Home = React.memo(function Home() {
  const {
    actions,
    commonPool,
    filters,
    isLoading,
    proposals,
    proposalPanel,
    totalStaked,
    totalSupply,
  } = useAppLogic()

  return (
    <div
      css={`
        margin: ${3 * GU}px;
        margin-bottom: 0;
      `}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <div
          css={`
            display: flex;
          `}
        >
          <div
            css={`
              flex-grow: 1;
            `}
          >
            <div>
              <Metrics
                commonPool={commonPool}
                onExecuteIssuance={actions.executeIssuance}
                totalActiveTokens={totalStaked}
                totalSupply={totalSupply}
              />
              <div
                css={`
                  display: flex;
                `}
              >
                <FilterSidebar
                  itemsStatus={filters.status.items}
                  itemsSupport={filters.support.items}
                  itemsType={filters.type.items}
                  proposalStatusFilter={filters.status.filter}
                  proposalSupportFilter={filters.support.filter}
                  proposalTypeFilter={filters.type.filter}
                  onClearFilters={filters.onClear}
                  onStatusFilterChange={filters.status.onChange}
                  onSupportFilterChange={filters.support.onChange}
                  onTypeFilterChange={filters.type.onChange}
                />
                <ProposalsList
                  activeFilters={filters.isActive}
                  proposals={proposals}
                  onProposalCountIncrease={filters.onProposalCountIncrease}
                  onRankingFilterChange={filters.ranking.onChange}
                  onStakeToProposal={actions.convictionActions.stakeToProposal}
                  onVoteOnDecision={actions.dandelionActions.voteOnDecision}
                  onWithdrawFromProposal={
                    actions.convictionActions.withdrawFromProposal
                  }
                  rankingItems={filters.ranking.items}
                  selectedRanking={filters.ranking.filter}
                />
              </div>
            </div>
          </div>

          <HeroBanner onRequestNewProposal={proposalPanel.requestOpen} />
        </div>
      )}

      <SidePanel
        title="New proposal"
        opened={proposalPanel.visible}
        onClose={proposalPanel.requestClose}
      >
        <AddProposalPanel onSubmit={actions.convictionActions.newProposal} />
      </SidePanel>
    </div>
  )
})

export default Home
