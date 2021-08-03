import AgreementSettings from './Apps/AgreementSettings'
import ConvictionVotingSettings from './Apps/ConvictionVotingSettings'
import GardenMetadata from './GardenMetadata'
import GardenTypeSelector from './GardenTypeSelector'
import HoneyswapLiquidity from './HoneyswapLiquidity'
import IssuanceSettings from './Apps/IssuanceSettings'
import LaunchGarden from './LaunchGarden'
import ReviewInformation from './ReviewInformation'
import TokensSettings from './Apps/TokensSettings'
import VotingSettings from './Apps/VotingSettings'

const STEPS = [
  'Select Garden type',
  'Add Garden metadata',
  'Configure tokenomics',
  'Configure governance',
  'Review information',
  'Launch Garden',
]

export const Screens = [
  {
    parent: STEPS[0],
    title: 'Type selection',
    Screen: GardenTypeSelector,
  },
  { parent: STEPS[1], title: 'Garden metadata', Screen: GardenMetadata },
  { parent: STEPS[2], title: 'Garden token', Screen: TokensSettings },
  {
    parent: STEPS[2],
    title: 'Honeyswap Liquidity',
    Screen: HoneyswapLiquidity,
  },
  {
    parent: STEPS[2],
    title: 'Issuance policy',
    Screen: IssuanceSettings,
  },
  {
    parent: STEPS[3],
    title: 'Community Convenant',
    Screen: AgreementSettings,
  },
  {
    parent: STEPS[3],
    title: 'Conviction voting',
    Screen: ConvictionVotingSettings,
  },
  {
    parent: STEPS[3],
    title: 'Decision voting',
    Screen: VotingSettings,
  },
  {
    parent: STEPS[4],
    title: 'Review information',
    Screen: ReviewInformation,
  },
  { parent: STEPS[5], title: 'Launch Garden', Screen: LaunchGarden },
]
