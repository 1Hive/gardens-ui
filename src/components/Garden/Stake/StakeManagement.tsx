// import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState, memo } from 'react'
import { Header } from '@1hive/1hive-ui'
import EmptyState from './EmptyState'
import { GardenLoader } from '@components/Loader'
import LayoutColumns from '../Layout/LayoutColumns'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import MultiModal from '@components/MultiModal/MultiModal'
import SideBar from './SideBar'
import StakeScreens from '../ModalFlows/StakeScreens/StakeScreens'
import StakingMovements from './StakingMovements'
import stakingEmptyLight from '@images/icons/stake/no-dataview-data.svg'
import stakingEmptyDark from '@images/icons/dark-mode/no-dataview-data.svg'
import { useStakingState } from '@providers/Staking'
import { useWallet } from '@providers/Wallet'
import { useAppTheme } from '@providers/AppTheme'

function StakeManagement() {
  const { account } = useWallet()
  const router = useRouter()
  // const [stakeModalMode, setStakeModalMode] = useState()
  const { appearance } = useAppTheme()
  const [stakeModalMode, setStakeModalMode] = useState<null | string>()
  const { stakeManagement, stakeActions, loading } = useStakingState()

  const handleOnCloseModal = useCallback(() => {
    stakeActions.reFetchTotalBalance()
    setStakeModalMode(null)
  }, [stakeActions])

  useEffect(() => {
    // Components that redirect to deposit collateral will do so through "garden/${gardenId}/collateral/deposit" url
    if (account && router.pathname.includes('deposit')) {
      setStakeModalMode('deposit')
    }
  }, [account, router])

  const orderedStakingMovements = useMemo(() => {
    if (!stakeManagement?.stakingMovements) {
      return []
    }

    return stakeManagement.stakingMovements.sort(
      (movement1: StakeMovement, movement2: StakeMovement) =>
        Number(movement2.disputableActionId) +
        Number(movement2.createdAt) -
        (Number(movement1.disputableActionId) + Number(movement1.createdAt))
    )
  }, [stakeManagement])

  if (!account) {
    return (
      <EmptyState
        icon={appearance === 'light' ? stakingEmptyLight : stakingEmptyDark}
      />
    )
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
}

export default memo(StakeManagement)
