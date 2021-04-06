import { QueryResult } from '@aragon/connect-thegraph'
import Proposal from '../../models/Proposal'
import VotingConfig from '../../models/VotingConfig'
import { CastData, ProposalData, StakeData, StakeHistoryData, VotingConfigData } from '../../types'

export function parseProposals(
  result: QueryResult,
  connector: any
): Proposal[] {
  const proposals = result.data.proposals

  if (!proposals) {
    throw new Error('Unable to parse proposals.')
  }

  const datas = proposals.map((proposal: ProposalData) => {
    // For votes (decisions)
    const casts = proposal.castVotes?.map((cast: CastData) => cast)

    // For proposals (discussions and proposals)
    const stakes = proposal.stakes?.map((stake: StakeData) => stake)
    const stakesHistory = proposal.stakesHistory?.map((stake: StakeHistoryData) => stake)

    let setting = null

    if(proposal.setting){
      const settingData : VotingConfigData = proposal.setting
      setting =  new VotingConfig(settingData)
    }

    return {
      ...proposal,
      casts,
      stakes,
      stakesHistory,
      setting
    }
  })

  return datas.map((data: ProposalData) => {
    return new Proposal(data, connector)
  })
}

export function parseProposal(result: QueryResult, connector: any): Proposal {
  const proposal = result.data.proposal

  if (!proposal) {
    throw new Error('Unable to parse proposal.')
  }

    // For votes (decisions)
    const casts = proposal.casts?.map((cast: CastData) => cast)

    // For proposals (suggestions and proposals)
    const stakes = proposal.stakes?.map((stake: StakeData) => stake)
    const stakesHistory = proposal.stakesHistory?.map((stake: StakeHistoryData) => stake)

    let setting = null

    if(proposal.setting){
      const settingData : VotingConfigData = proposal.setting
      setting =  new VotingConfig(settingData)
    }

    const data = {
      ...proposal,
      casts,
      stakes,
      stakesHistory,
      setting,
      submitterArbitratorFeeId: proposal.submitterArbitratorFee?.id,
      challengerArbitratorFeeId: proposal.challengerArbitratorFee?.id
    }

    return new Proposal(data, connector)
}
