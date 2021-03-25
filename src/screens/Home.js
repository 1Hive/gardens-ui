import React, { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { GU, useLayout, useViewport } from '@1hive/1hive-ui'

import Filters from '../components/Filters/Filters'
import HeroBanner from '../components/Feed/HeroBanner'
import Loader from '../components/Loader'
import Metrics from '../components/Metrics'
import NetworkErrorModal from '../components/NetworkErrorModal'
import ProposalsList from '../components/Feed/ProposalsList'

import MultiModal from '../components/MultiModal/MultiModal'
import CreateProposalScreens from '../components/ModalFlows/CreateProposalScreens/CreateProposalScreens'

import useAppLogic from '../logic/app-logic'
import { useWallet } from '../providers/Wallet'

const Home = React.memo(function Home() {
  const [filterSliderVisible, setFilterSidlerVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const {
    actions,
    commonPool,
    errors,
    filters,
    isLoading,
    proposals,
    proposalsFetchedCount,
    totalStaked,
    totalSupply,
  } = useAppLogic()

  const history = useHistory()
  const { account } = useWallet()

  // min layout is never returned
  const { below } = useViewport()
  const { layoutName } = useLayout()
  const largeMode = layoutName === 'large'
  const compactMode = layoutName === 'small' || layoutName === 'medium'

  const handleFilterSliderToggle = useCallback(() => {
    setFilterSidlerVisible(visible => !visible)
  }, [])

  useEffect(() => {
    // Components that redirect to create a proposal will do so through "/home/create" url
    if (account && history.location.pathname.includes('create')) {
      setModalVisible(true)
    }
  }, [account, history])

  const handleShowModal = useCallback(() => {
    setModalVisible(true)
  }, [])

  const handleHideModal = useCallback(() => {
    setModalVisible(false)

    if (history.location.pathname.includes('create')) {
      history.push('/home')
    }
  }, [history])

  // TODO: Refactor components positioning with a grid layout
  return (
    <div>
      <NetworkErrorModal visible={Boolean(errors)} />
      {isLoading ? (
        <Loader />
      ) : (
        <div>
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
                    onExecuteIssuance={actions.issuanceActions.executeIssuance}
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
                    onStakeToProposal={
                      actions.convictionActions.stakeToProposal
                    }
                    onToggleFilterSlider={handleFilterSliderToggle}
                    onVoteOnDecision={actions.votingActions.voteOnDecision}
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
                      <HeroBanner onRequestNewProposal={handleShowModal} />
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
                <HeroBanner onRequestNewProposal={handleShowModal} />
              </div>
            )}
          </div>
          <MultiModal visible={modalVisible} onClose={handleHideModal}>
            <CreateProposalScreens />
          </MultiModal>
        </div>
      )}
    </div>
  )
})

export default Home
