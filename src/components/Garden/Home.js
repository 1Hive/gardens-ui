import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { BackButton, GU, useLayout, useViewport } from '@1hive/1hive-ui'

import { useWallet } from '@providers/Wallet'
import useGardenLogic from '@/logic/garden-logic'
import { useConnectedGarden } from '@/providers/ConnectedGarden'

import Metrics from './Metrics'
import Filters from './Filters/Filters'
import { GardenLoader } from '../Loader'
import RightPanel from './Feed/RightPanel'
import ProposalsList from './Feed/ProposalsList'
import MultiModal from '../MultiModal/MultiModal'
import NetworkErrorModal from '../NetworkErrorModal'
import WrapTokenScreens from './ModalFlows/WrapTokenScreens/WrapTokenScreens'
import PriceOracleScreens from './ModalFlows/PriceOracleScreens/PriceOracleScreens'
import ClaimRewardsScreens from './ModalFlows/ClaimRewardsScreens/ClaimRewardsScreens'
import CreateProposalScreens from './ModalFlows/CreateProposalScreens/CreateProposalScreens'
import DelegateVotingScreens from './ModalFlows/DelegateVotingScreens/DelegateVotingScreens'

function Home() {
  const connectedGarden = useConnectedGarden()

  if (!connectedGarden) {
    return null
  }

  const [filterSliderVisible, setFilterSidlerVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState(null)
  const {
    actions,
    commonPool,
    errors,
    filters,
    loading,
    priceToken,
    proposals,
    proposalsFetchedCount,
    totalActiveTokens,
    totalSupply,
    totalWrappedSupply,
  } = useGardenLogic()

  const router = useRouter()
  const { account } = useWallet()

  // min layout is never returned
  const { below } = useViewport()
  const { layoutName } = useLayout()
  const largeMode = layoutName === 'large'
  const compactMode = layoutName === 'small' || layoutName === 'medium'

  const handleBack = useCallback(() => {
    router.push('/home')
  }, [router])

  const handleFilterSliderToggle = useCallback(() => {
    setFilterSidlerVisible((visible) => !visible)
  }, [])

  const handleShowModal = useCallback((mode) => {
    setModalVisible(true)
    setModalMode(mode)
  }, [])

  const handleHideModal = useCallback(() => {
    setModalVisible(false)

    if (router.query.create) {
      router.push(location.pathname)
    }
  }, [router])

  const handleClaimRewards = useCallback(() => {
    handleShowModal('claim')
  }, [handleShowModal])

  const handleSetDelegate = useCallback(() => {
    handleShowModal('delegate')
  }, [handleShowModal])

  const handleRemoveDelagate = useCallback(() => {
    handleShowModal('removeDelegate')
  }, [handleShowModal])

  const handleRequestNewProposal = useCallback(() => {
    handleShowModal('createProposal')
  }, [handleShowModal])

  const handleWrapToken = useCallback(() => {
    handleShowModal('wrap')
  }, [handleShowModal])

  const handleUnwrapToken = useCallback(() => {
    handleShowModal('unwrap')
  }, [handleShowModal])

  const handleUpdatePriceOracle = useCallback(() => {
    handleShowModal('updatePriceOracle')
  }, [handleShowModal])

  const handleProposalCreated = useCallback(() => {
    filters.ranking.onChange(1)
  }, [filters])

  useEffect(() => {
    console.log('I got triggered')
    // Components that redirect to create a proposal will do so through "garden/${gardenId}/create" url
    if (account && router.query.create) {
      handleRequestNewProposal()
    }
  }, [account, handleRequestNewProposal, router])

  // TODO: Refactor components positioning with a grid layout

  return (
    <div
      css={`
        height: 100%;
      `}
    >
      {loading ? (
        <GardenLoader />
      ) : (
        <>
          <div
            css={`
              margin-left: ${1 * GU}px;
              position: ${compactMode ? 'absolute' : 'sticky'};
              top: 16px;
              z-index: 2;
            `}
          >
            {below('medium') && (
              <BackButton
                onClick={handleBack}
                css={`
                  background: transparent;
                  border: 0;
                `}
              />
            )}
          </div>
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
                  {layoutName !== 'small' && (
                    <Metrics
                      commonPool={commonPool}
                      onRequestUpdatePriceOracle={handleUpdatePriceOracle}
                      onExecuteIssuance={
                        actions.issuanceActions.executeIssuance
                      }
                      priceToken={priceToken}
                      totalActiveTokens={totalActiveTokens}
                      totalSupply={totalSupply}
                      totalWrappedSupply={totalWrappedSupply}
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
                      onToggleFilterSlider={handleFilterSliderToggle}
                      rankingItems={filters.ranking.items}
                      selectedRanking={filters.ranking.filter}
                    />
                    {largeMode && (
                      <div
                        css={`
                          margin-left: ${3 * GU}px;
                        `}
                      >
                        <RightPanel
                          onClaimRewards={handleClaimRewards}
                          onRequestNewProposal={handleRequestNewProposal}
                          onWrapToken={handleWrapToken}
                          onUnwrapToken={handleUnwrapToken}
                          onSetDelegate={handleSetDelegate}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!largeMode && (
                <RightPanel
                  onClaimRewards={handleClaimRewards}
                  onRemoveDelegate={handleRemoveDelagate}
                  onRequestNewProposal={handleRequestNewProposal}
                  onSetDelegate={handleSetDelegate}
                  onWrapToken={handleWrapToken}
                  onUnwrapToken={handleUnwrapToken}
                />
              )}
            </div>
            <MultiModal
              visible={modalVisible}
              onClose={handleHideModal}
              onClosed={() => setModalMode(null)}
            >
              {modalMode === 'updatePriceOracle' && <PriceOracleScreens />}
              {modalMode === 'createProposal' && (
                <CreateProposalScreens onComplete={handleProposalCreated} />
              )}
              {(modalMode === 'wrap' || modalMode === 'unwrap') && (
                <WrapTokenScreens mode={modalMode} />
              )}
              {modalMode === 'claim' && <ClaimRewardsScreens />}
              {(modalMode === 'delegate' || modalMode === 'removeDelegate') && (
                <DelegateVotingScreens mode={modalMode} />
              )}
            </MultiModal>
          </div>
        </>
      )}
      <NetworkErrorModal visible={Boolean(errors)} />
    </div>
  )
}

export default React.memo(Home)
