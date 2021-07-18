import AgreementSettings from './Apps/AgreementSettings'
import ConvictionVotingSettings from './Apps/ConvictionVotingSettings/ConvictionVotingSettings'
import GardenMetadata from './GardenMetadata'
import GardenTypeSelector from './GardenTypeSelector'
import HoneyswapLiquidity from './HoneyswapLiquidity'
import IssuanceSettings from './Apps/IssuanceSettings'
import LaunchGarden from './LaunchGarden'
import ReviewInformation from './ReviewInformation'
import TokensSettings from './Apps/TokensSettings'
import VotingSettings from './Apps/VotingSettings'

const STEPS = [
  'Select garden type',
  'Configure garden',
  'Review information',
  'Launch Garden',
]

export const Screens = [
  {
    key: STEPS[0],
    title: 'Type selection',
    Screen: GardenTypeSelector,
  },
  { key: STEPS[1], title: 'Garden metadata', Screen: GardenMetadata },
  {
    key: STEPS[1],
    title: 'Honeyswap Liquidity',
    Screen: HoneyswapLiquidity,
  },
  {
    key: STEPS[1],
    title: 'Tokens settings',
    Screen: TokensSettings,
  },
  {
    key: STEPS[1],
    title: 'Voting settings',
    Screen: VotingSettings,
  },
  {
    key: STEPS[1],
    title: 'Conviction Voting settings',
    Screen: ConvictionVotingSettings,
  },
  {
    key: STEPS[1],
    title: 'Issuance settings',
    Screen: IssuanceSettings,
  },
  {
    key: STEPS[1],
    title: 'Covenant settings',
    Screen: AgreementSettings,
  },
  {
    key: STEPS[2],
    title: 'Review information',
    Screen: ReviewInformation,
  },
  { key: STEPS[3], title: 'Launch Garden', Screen: LaunchGarden },
]
