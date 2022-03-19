export enum ProposalTypes {
  Decision = 'PROPOSAL_TYPE_DECISION',
  Proposal = 'PROPOSAL_TYPE_PROPOSAL',
  Suggestion = 'PROPOSAL_TYPE_SUGGESTION',
}

const symbolMapping: {
  [x: string]: ProposalTypes
} = {
  Decision: ProposalTypes.Decision,
  Proposal: ProposalTypes.Proposal,
  Suggestion: ProposalTypes.Suggestion,
}

const stringMapping: {
  [x: string]: string
} = {
  [ProposalTypes.Decision]: 'Decision',
  [ProposalTypes.Proposal]: 'Funding',
  [ProposalTypes.Suggestion]: 'Suggestion',
}

// Maps to typeInt number from subgraph, useful for queries
const intMapping: {
  [x: string]: number
} = {
  [ProposalTypes.Decision]: 2,
  [ProposalTypes.Proposal]: 1,
  [ProposalTypes.Suggestion]: 0,
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
