import AgreementSettings from './Apps/AgreementSettings'
import ConvictionVotingSettings from './Apps/ConvictionVotingSettings'
import GardenMetadata from './GardenMetadata'
import GardenTypeSelector from './GardenTypeSelector'
import HoneyswapLiquidity from './HoneyswapLiquidity'
import IssuanceSettings from './Apps/IssuanceSettings'
import LaunchGarden from './LaunchGarden'
import ReviewInformation from './ReviewInformation'
import TokenSettings from './Apps/TokenSettings'
import VotingSettings from './Apps/VotingSettings'

const STEPS = [
  'Select type',
  'Add profile',
  'Configure tokenomics',
  'Configure governance',
  'Review information',
  'Launch garden',
]

export const Screens = [
  {
    parent: STEPS[0],
    title: 'Type selection',
    Screen: GardenTypeSelector,
  },
  { parent: STEPS[1], title: 'Garden metadata', Screen: GardenMetadata },
  { parent: STEPS[2], title: 'Garden token', Screen: TokenSettings },
  {
    parent: STEPS[2],
    title: 'Honeyswap liquidity',
    Screen: HoneyswapLiquidity,
  },
  {
    parent: STEPS[2],
    title: 'Issuance policy',
    Screen: IssuanceSettings,
  },
  {
    parent: STEPS[3],
    title: 'Community convenant',
    Screen: AgreementSettings,
  },
  {
    parent: STEPS[3],
    title: 'Conviction voting',
    Screen: ConvictionVotingSettings,
  },
  {
    parent: STEPS[3],
    title: 'Tao voting',
    Screen: VotingSettings,
  },
  {
    parent: STEPS[4],
    title: 'Review information',
    Screen: ReviewInformation,
  },
  { parent: STEPS[5], title: 'Launch garden', Screen: LaunchGarden },
]
