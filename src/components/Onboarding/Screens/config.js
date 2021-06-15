import AgreementSettings from './Apps/AgreementSettings'
import ConvictionVotingSettings from './Apps/ConvictionVotingSettings'
import IssuanceSettings from './Apps/IssuanceSettings'
import TokensSettings from './Apps/TokensSettings'
import VotingSettings from './Apps/VotingSettings'
import GardenTypeSelector from './GardenTypeSelector'
import GardenMetadata from './GardenMetadata'
import HoneyswapLiquidity from './HoneyswapLiquidity'

export const Screens = [
  { Screen: GardenTypeSelector, title: 'Type selection' },
  { Screen: GardenMetadata, title: 'Garden data' },
  { Screen: HoneyswapLiquidity, title: 'Honeyswap Liquidity' },
  { Screen: TokensSettings, title: 'Tokens settings' },
  { Screen: VotingSettings, title: 'Voting settings' },
  { Screen: ConvictionVotingSettings, title: 'Conviction Voting settings' },
  { Screen: IssuanceSettings, title: 'Issuance settings' },
  { Screen: AgreementSettings, title: 'Covenant settings' },
]
