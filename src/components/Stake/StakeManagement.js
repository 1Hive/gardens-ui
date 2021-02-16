import React, { useCallback, useState } from 'react'
import { Header } from '@1hive/1hive-ui'
import EmptyState from './EmptyState'
import LayoutColumns from '../Layout/LayoutColumns'
import LayoutGutter from '../Layout/LayoutGutter'
import LayoutLimiter from '../Layout/LayoutLimiter'
import MultiModal from '../MultiModal/MultiModal'
import SideBar from './SideBar'
import StakeScreens from '../ModalFlows/StakeScreens/StakeScreens'
import StakingMovements from './StakingMovements'
import stakingEmpty from './assets/staking-empty.png'
import { useStakingState } from '../../providers/Staking'

const StakeManagement = React.memo(function StakeManagement() {
  const [stakeModalMode, setStakeModalMode] = useState()
  const { stakeManagement, stakeActions } = useStakingState()

  const handleOnCloseModal = useCallback(() => {
    stakeActions.reFetchTotalBalance()
    setStakeModalMode(null)
  }, [stakeActions])

  return (
    <LayoutGutter>
      <LayoutLimiter>
        <Header primary="Stake Management" />
        {stakeManagement ? (
          <LayoutColumns
            primary={
              stakeManagement.stakingMovements ? (
                <StakingMovements
                  stakingMovements={stakeManagement.stakingMovements}
                  token={stakeManagement.token}
                />
              ) : (
                <EmptyState
                  icon={stakingEmpty}
                  title="No transactions yet"
                  paragraph="You can start by depositing some HNY into the staking pool before you can submit a proposal."
                />
              )
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
        ) : (
          <EmptyState
            icon={stakingEmpty}
            title="Enable your account"
            paragraph="Connect to an Ethereum provider to access your staking data. You may be temporarily redirected to a new screen."
          />
        )}
      </LayoutLimiter>
      <MultiModal
        visible={Boolean(stakeModalMode)}
        onClose={handleOnCloseModal}
        onClosed={() => setStakeModalMode(null)}
      >
        {(stakeModalMode === 'withdraw' || stakeModalMode === 'deposit') && (
          <StakeScreens
            mode={stakeModalMode}
            stakeManagement={stakeManagement}
            stakeActions={stakeActions}
          />
        )}
      </MultiModal>
    </LayoutGutter>
  )
})

export default StakeManagement
