type StakeMovement = {
  actionId: string
  actionState: string
  agreementId: string
  amount: string
  collateralState: string
  createdAt: string | number
  disputableActionId: string | number
  disputableAddress: string
  id: string
  stakingId: string
  tokenDecimals: number
  tokenId: string
  tokenSymbol: string
}

type SideBarProps = {
  stakeActions: StakeActionsType
  staking: {
    available: number
    locked: number
    total: number
    allowance: number
  }
  onDepositOrWithdraw: Dispatch<SetStateAction<string | null | undefined>>
}

type CardContentProps = {
  amount: BigNumber
  icon: string
  title: string
  secondary?: boolean
  tokenAmount: any
}

type StakeActionsType = {
  allowManager: () => void
  approveTokenAmount: (amount: BigNumber) => void
  getAllowance: () => void
  getStakedAmount: () => void
  reFetchTotalBalance: () => void
  stake: () => void
  unlockAndRemoveManager: () => void
  withdraw: () => void
}

type BalanceCardProps = {
  allowance: BigNumber
  locked: BigNumber
  stakeActions: StakeActionsType
  total: BigNumber
  onDepositOrWithdraw: (x: string) => void
}

type ActionType = {
  color: string
  background?: string
  icon?: React.ReactNode
}

type CollateralType = {
  color: string
  icon?: React.ReactNode
}
