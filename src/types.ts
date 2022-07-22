import { ProposalType } from './types/app'

export enum ProposalTypes {
  Decision = 'PROPOSAL_TYPE_DECISION',
  Proposal = 'PROPOSAL_TYPE_PROPOSAL',
  Suggestion = 'PROPOSAL_TYPE_SUGGESTION',
  Poll = 'PROPOSAL_TYPE_POLL',
}

const symbolMapping: {
  [x: string]: ProposalTypes
} = {
  Decision: ProposalTypes.Decision,
  Proposal: ProposalTypes.Proposal,
  Suggestion: ProposalTypes.Suggestion,
  Poll: ProposalTypes.Poll,
}

const stringMapping: {
  [x: string]: string
} = {
  [ProposalTypes.Decision]: 'Decision',
  [ProposalTypes.Proposal]: 'Funding',
  [ProposalTypes.Suggestion]: 'Suggestion',
  [ProposalTypes.Poll]: 'Poll',
}

// Maps to typeInt number from subgraph, useful for queries
const intMapping: {
  [x: string]: number
} = {
  [ProposalTypes.Decision]: 2,
  [ProposalTypes.Proposal]: 1,
  [ProposalTypes.Suggestion]: 0,
  [ProposalTypes.Poll]: -1,
}

export function convertFromString(str: string) {
  return symbolMapping[str]
}

export function convertToString(symbol: string) {
  return stringMapping[symbol]
}

export function convertToInt(symbol: string) {
  return intMapping[symbol]
}

export const isPollProposal = (proposal: ProposalType) => {
  return proposal.metadata.includes('Poll -')
}
