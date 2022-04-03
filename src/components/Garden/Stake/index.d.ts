type StakeMovement = {
  amount: any
  createdAt: number
  actionState: string
  collateralState: string
  tokenDecimals: string
  disputableActionId: number
  disputableAddress: string
}

type SideBarProps = {
  stakeActions: string
  staking: {
    available: number
    locked: number
    total: number
    allowance: number
  }
  token: {
    id: string
    decimals: number
    symbol: string
  }
  onDepositOrWithdraw: Dispatch<SetStateAction<string | null | undefined>>
}

type CardContentProps = {
  amount: any
  icon: string
  title: string
  secondary?: boolean
  tokenAmount: any
}

type BalanceCardProps = {
  allowance: any
  locked: any
  stakeActions: any
  total: any
  tokenAddress: string
  tokenDecimals: number
  tokenSymbol: string
  onDepositOrWithdraw: (x: string) => void
}
