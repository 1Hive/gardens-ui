import { QueryResult } from '@aragon/connect-thegraph'
import Proposal from '../../models/Proposal'
import { CastData, ProposalData, StakeData, StakeHistoryData } from '../../types'

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
    const casts = proposal.casts?.map((cast: CastData) => cast)

    // For proposals (discussions and proposals)
    const stakes = proposal.stakes?.map((stake: StakeData) => stake)
    const stakesHistory = proposal.stakesHistory?.map((stake: StakeHistoryData) => stake)

    return {
      ...proposal,
      casts,
      stakes,
      stakesHistory
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

    const data = {
      ...proposal,
      casts,
      stakes,
      stakesHistory
    }

    return new Proposal(data, connector)
}
