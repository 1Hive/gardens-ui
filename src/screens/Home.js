import React, { useCallback, useState } from 'react'
import { GU, SidePanel, useViewport } from '@1hive/1hive-ui'

import AddProposalPanel from '../components/panels/AddProposalPanel'
import FilterSidebar from '../components/FilterSidebar/FilterSidebar'
import HeroBanner from '../components/Feed/HeroBanner'
import Loader from '../components/Loader'
import Metrics from '../components/Metrics'
import ProposalsList from '../components/Feed/ProposalsList'

import useAppLogic from '../logic/app-logic'
import { useLayout } from '../components/Layout'

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

  const [filterSliderVisible, setFilterSidlerVisible] = useState(false)

  const handleFilterSliderToggle = useCallback(() => {
    setFilterSidlerVisible(visible => !visible)
  }, [])

  // min layout is never returned
  const { below } = useViewport()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small' || layoutName === 'medium'

  return (
    <div>
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
                  onExecuteIssuance={actions.executeIssuance}
                  totalActiveTokens={totalStaked}
                  totalSupply={totalSupply}
                />
              )}
              <div
                css={`
                  display: flex;
                  flex-wrap: ${compactMode ? 'wrap' : 'nowrap'};
                  column-gap: ${8 * GU}px;
                `}
              >
                <FilterSidebar
                  compact={compactMode}
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
                  sliderVisible={filterSliderVisible}
                />
                <ProposalsList
                  activeFilters={filters.isActive}
                  proposals={proposals}
                  onProposalCountIncrease={filters.onProposalCountIncrease}
                  onRankingFilterChange={filters.ranking.onChange}
                  onStakeToProposal={actions.stakeToProposal}
                  onToggleFilterSlider={handleFilterSliderToggle}
                  onWithdrawFromProposal={actions.withdrawFromProposal}
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
        <AddProposalPanel onSubmit={actions.newProposal} />
      </SidePanel>
    </div>
  )
})

export default Home
