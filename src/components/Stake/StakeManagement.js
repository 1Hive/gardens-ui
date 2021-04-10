import React, { useCallback, useMemo, useState } from 'react'
import { Header } from '@1hive/1hive-ui'
import EmptyState from './EmptyState'
import LayoutColumns from '../Layout/LayoutColumns'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import Loader from '../Loader'
import MultiModal from '../MultiModal/MultiModal'
import SideBar from './SideBar'
import StakeScreens from '../ModalFlows/StakeScreens/StakeScreens'
import StakingMovements from './StakingMovements'
import stakingEmpty from './assets/no-dataview-data.svg'
import { useStakingState } from '../../providers/Staking'
import { useWallet } from '../../providers/Wallet'

const StakeManagement = React.memo(function StakeManagement() {
  const { account } = useWallet()
  const [stakeModalMode, setStakeModalMode] = useState()
  const { stakeManagement, stakeActions, loading } = useStakingState()

  const handleOnCloseModal = useCallback(() => {
    stakeActions.reFetchTotalBalance()
    setStakeModalMode(null)
  }, [stakeActions])

  const orderedStakingMovements = useMemo(() => {
    if (!stakeManagement?.stakingMovements) {
      return []
    }

    return stakeManagement.stakingMovements.sort(
      (movement1, movement2) =>
        movement1.disputableActionId - movement2.disputableActionId
    )
  }, [stakeManagement])

  if (!account) {
    return <EmptyState icon={stakingEmpty} />
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <LayoutGutter>
          <LayoutLimiter>
            <Header primary="Collateral Manager" />

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
