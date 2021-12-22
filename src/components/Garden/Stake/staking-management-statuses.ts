export enum StakingType {
  STAKING_SCHEDULED = 'STAKING_SCHEDULED',
  STAKING_CHALLENGED = 'STAKING_CHALLENGED',
  STAKING_COMPLETED = 'STAKING_COMPLETED',
  STAKING_CANCELLED = 'STAKING_CANCELLED',
  STAKING_SETTLED = 'STAKING_SETTLED',
}

export enum StakingCollateralType {
  COLLATERAL_LOCKED = 'COLLATERAL_LOCKED',
  COLLATERAL_CHALLENGED = 'COLLATERAL_CHALLENGED',
  COLLATERAL_AVAILABLE = 'COLLATERAL_AVAILABLE',
  COLLATERAL_SLASHED = 'COLLATERAL_SLASHED',
}

export const StakingStatusesMap = new Map([
  ['Scheduled', StakingType.STAKING_SCHEDULED],
  ['Settled', StakingType.STAKING_SETTLED],
  ['Challenged', StakingType.STAKING_CHALLENGED],
  ['Completed', StakingType.STAKING_COMPLETED],
  ['Cancelled', StakingType.STAKING_CANCELLED],
])

export const CollateralStatusesMap = new Map([
  ['Locked', StakingCollateralType.COLLATERAL_LOCKED],
  ['Challenged', StakingCollateralType.COLLATERAL_CHALLENGED],
  ['Available', StakingCollateralType.COLLATERAL_AVAILABLE],
  ['Slashed', StakingCollateralType.COLLATERAL_SLASHED],
])
