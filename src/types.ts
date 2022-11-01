import { POLL_PROPOSAL_START_TEXT } from './components/Garden/ModalFlows/CreateProposalScreens/AddProposal'
import { ProposalType } from './types/app'

export enum ProposalTypes {
  Decision = 'PROPOSAL_TYPE_DECISION',
  Proposal = 'PROPOSAL_TYPE_PROPOSAL',
  Suggestion = 'PROPOSAL_TYPE_SUGGESTION',
  Stream = 'PROPOSAL_TYPE_STREAM',
  Poll = 'PROPOSAL_TYPE_POLL',
}

const symbolMapping: {
  [x: string]: ProposalTypes
} = {
  Decision: ProposalTypes.Decision,
  Proposal: ProposalTypes.Proposal,
  Suggestion: ProposalTypes.Suggestion,
  Stream: ProposalTypes.Stream,
  Poll: ProposalTypes.Poll,
}

const stringMapping: {
  [x: string]: string
} = {
  [ProposalTypes.Decision]: 'Decision',
  [ProposalTypes.Proposal]: 'Funding',
  [ProposalTypes.Suggestion]: 'Suggestion',
  [ProposalTypes.Stream]: 'Stream',
  [ProposalTypes.Poll]: 'Poll',
}

// Maps to typeInt number from subgraph, useful for queries
const intMapping: {
  [x: string]: number
} = {
  [ProposalTypes.Stream]: 3,
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
  return proposal.metadata.includes(POLL_PROPOSAL_START_TEXT)
}
