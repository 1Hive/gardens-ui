export enum StakingType {
  Scheduled = 'STAKING_SCHEDULED',
  Challenged = 'STAKING_CHALLENGED',
  Completed = 'STAKING_COMPLETED',
  Cancelled = 'STAKING_CANCELLED',
  Settled = 'STAKING_SETTLED',
}

export enum StakingCollateralType {
  Locked = 'COLLATERAL_LOCKED',
  Challenged = 'COLLATERAL_CHALLENGED',
  Available = 'COLLATERAL_AVAILABLE',
  Slashed = 'COLLATERAL_SLASHED',
}

// TODO: _tiago deal with this map, its not need anymore with the enum
export const StakingStatusesMap = new Map([
  ['Scheduled', StakingType.Scheduled],
  ['Settled', StakingType.Settled],
  ['Challenged', StakingType.Challenged],
  ['Completed', StakingType.Completed],
  ['Cancelled', StakingType.Cancelled],
])

export const CollateralStatusesMap = new Map([
  ['Locked', StakingCollateralType.Locked],
  ['Challenged', StakingCollateralType.Challenged],
  ['Available', StakingCollateralType.Available],
  ['Slashed', StakingCollateralType.Slashed],
])
