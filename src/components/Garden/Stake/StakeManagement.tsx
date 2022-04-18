import { useRouter } from 'next/router'
import { Header } from '@1hive/1hive-ui'
import React, { useCallback, useEffect, useMemo, useState, memo } from 'react'

import SideBar from './SideBar'
import EmptyState from './EmptyState'
import { useWallet } from '@providers/Wallet'
import StakingMovements from './StakingMovements'
import { GardenLoader } from '@components/Loader'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutColumns from '../Layout/LayoutColumns'
import LayoutLimiter from '../Layout/LayoutLimiter'
import { useStakingState } from '@providers/Staking'
import MultiModal from '@components/MultiModal/MultiModal'
import { useConnectedGarden } from '@/providers/ConnectedGarden'
import StakeScreens from '../ModalFlows/StakeScreens/StakeScreens'

function StakeManagement() {
  const connectedGarden = useConnectedGarden()

  if (!connectedGarden) {
    return null
  }

  const { account } = useWallet()
  const router = useRouter()
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
    return <EmptyState icon={'/icons/stake/no-dataview-data.svg'} />
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
