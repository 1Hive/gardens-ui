import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router'

import { Header } from '@1hive/1hive-ui'

import { GardenLoader } from '@components/Loader'
import MultiModal from '@components/MultiModal/MultiModal'

import { useStakingState } from '@providers/Staking'
import { useWallet } from '@providers/Wallet'

import LayoutColumns from '../Layout/LayoutColumns'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import StakeScreens from '../ModalFlows/StakeScreens/StakeScreens'
import EmptyState from './EmptyState'
import SideBar from './SideBar'
import StakingMovements from './StakingMovements'
import stakingEmpty from './assets/no-dataview-data.svg'

const StakeManagement = React.memo(function StakeManagement() {
  const { account } = useWallet()
  const history = useHistory()
  const [stakeModalMode, setStakeModalMode] = useState()
  const { stakeManagement, stakeActions, loading } = useStakingState()

  const handleOnCloseModal = useCallback(() => {
    stakeActions.reFetchTotalBalance()
    setStakeModalMode(null)
  }, [stakeActions])

  useEffect(() => {
    // Components that redirect to deposit collateral will do so through "garden/${gardenId}/collateral/deposit" url
    if (account && history.location.pathname.includes('deposit')) {
      setStakeModalMode('deposit')
    }
  }, [account, history])

  const orderedStakingMovements = useMemo(() => {
    if (!stakeManagement?.stakingMovements) {
      return []
    }

    return stakeManagement.stakingMovements.sort(
      (movement1, movement2) =>
        movement2.disputableActionId +
        movement2.createdAt -
        (movement1.disputableActionId + movement1.createdAt)
    )
  }, [stakeManagement])

  if (!account) {
    return <EmptyState icon={stakingEmpty} />
  }

  return (
    <>
      {loading ? (
        <GardenLoader />
      ) : (
        <LayoutGutter>
          <LayoutLimiter>
            <Header primary="Deposit Manager" />

            <LayoutColumns
              primary={
                <StakingMovements
                  stakingMovements={orderedStakingMovements}
                  token={stakeManagement.token}
                />
              }
              secondary={
                <SideBar
                  stakeActions={stakeActions}
                  staking={stakeManagement.staking}
                  token={stakeManagement.token}
                  onDepositOrWithdraw={setStakeModalMode}
                />
              }
              inverted
            />
          </LayoutLimiter>
          <MultiModal
            visible={Boolean(stakeModalMode)}
            onClose={handleOnCloseModal}
            onClosed={() => setStakeModalMode(null)}
          >
            {(stakeModalMode === 'withdraw' ||
              stakeModalMode === 'deposit') && (
              <StakeScreens
                mode={stakeModalMode}
                stakeManagement={stakeManagement}
                stakeActions={stakeActions}
              />
            )}
          </MultiModal>
        </LayoutGutter>
      )}
    </>
  )
})

export default StakeManagement
