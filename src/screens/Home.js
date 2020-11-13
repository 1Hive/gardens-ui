import React, { useCallback, useState } from 'react'
import { GU, SidePanel, useLayout, useViewport } from '@1hive/1hive-ui'

import AddProposalPanel from '../components/panels/AddProposalPanel'
import Filters from '../components/Filters/Filters'
import HeroBanner from '../components/Feed/HeroBanner'
import Loader from '../components/Loader'
import Metrics from '../components/Metrics'
import NetworkErrorModal from '../components/NetworkErrorModal'
import ProposalsList from '../components/Feed/ProposalsList'

import useAppLogic from '../logic/app-logic'

const Home = React.memo(function Home() {
  const {
    actions,
    commonPool,
    errors,
    filters,
    isLoading,
    proposals,
    proposalsFetchedCount,
    proposalPanel,
    totalStaked,
    totalSupply,
  } = useAppLogic()

  const [filterSliderVisible, setFilterSidlerVisible] = useState(false)

  const handleFilterSliderToggle = useCallback(() => {
    setFilterSidlerVisible(visible => !visible)
  }, [])

  // min layout is never returned
  const { below } = useViewport()
  const { layoutName } = useLayout()
  const largeMode = layoutName === 'large'
  const compactMode = layoutName === 'small' || layoutName === 'medium'

  // TODO: Refactor components positioning with a grid layout
  return (
    <div>
      <NetworkErrorModal visible={errors} />
      {isLoading ? (
        <Loader />
      ) : (
        <div
          css={`
            display: flex;
            flex-direction: ${compactMode ? 'column-reverse' : 'row'};
          `}
        >
          <div
            css={`
              flex-grow: 1;
            `}
          >
            <div
              css={`
                margin: ${(below('medium') ? 0 : 3) * GU}px;
              `}
            >
              {!compactMode && (
                <Metrics
                  commonPool={commonPool}
                  onExecuteIssuance={actions.convictionActions.executeIssuance}
                  totalActiveTokens={totalStaked}
                  totalSupply={totalSupply}
                />
              )}
              <div
                css={`
                  display: flex;
                  flex-wrap: ${compactMode ? 'wrap' : 'nowrap'};
                `}
              >
                <Filters
                  compact={compactMode}
                  itemsStatus={filters.status.items}
                  itemsSupport={filters.support.items}
                  itemsType={filters.type.items}
                  proposalNameFilter={filters.name.filter}
                  proposalStatusFilter={filters.status.filter}
                  proposalSupportFilter={filters.support.filter}
                  proposalTypeFilter={filters.type.filter}
                  onClearFilters={filters.onClear}
                  onNameFilterChange={filters.name.onChange}
                  onStatusFilterChange={filters.status.onChange}
                  onSupportFilterChange={filters.support.onChange}
                  onTypeFilterChange={filters.type.onChange}
                  onToggleFilterSlider={handleFilterSliderToggle}
                  sliderVisible={filterSliderVisible}
                />
                <ProposalsList
                  activeFilters={filters.isActive}
                  proposals={proposals}
                  proposalsFetchedCount={proposalsFetchedCount}
                  proposalCountFilter={filters.count.filter}
                  onProposalCountIncrease={filters.count.onChange}
                  onRankingFilterChange={filters.ranking.onChange}
                  onStakeToProposal={actions.convictionActions.stakeToProposal}
                  onToggleFilterSlider={handleFilterSliderToggle}
                  onVoteOnDecision={actions.dandelionActions.voteOnDecision}
                  onWithdrawFromProposal={
                    actions.convictionActions.withdrawFromProposal
                  }
                  rankingItems={filters.ranking.items}
                  selectedRanking={filters.ranking.filter}
                />
                {largeMode && (
                  <div
                    css={`
                      margin-left: ${3 * GU}px;
                    `}
                  >
                    <HeroBanner
                      onRequestNewProposal={proposalPanel.requestOpen}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {!largeMode && (
            <div
              css={`
                margin-right: ${(compactMode ? 0 : 3) * GU}px;
              `}
            >
              <HeroBanner onRequestNewProposal={proposalPanel.requestOpen} />
            </div>
          )}
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
