export const ProposalTypes = {
  Decision: Symbol('PROPOSAL_TYPE_DECISION'),
  Proposal: Symbol('PROPOSAL_TYPE_PROPOSAL'),
  Suggestion: Symbol('PROPOSAL_TYPE_SUGGESTION'),
}

const symbolMapping = {
  Decision: ProposalTypes.Decision,
  Proposal: ProposalTypes.Proposal,
  Suggestion: ProposalTypes.Suggestion,
}

const stringMapping = {
  [ProposalTypes.Decision]: 'Decision',
  [ProposalTypes.Proposal]: 'Funding',
  [ProposalTypes.Suggestion]: 'Suggestion',
}

// Maps to typeInt number from subgraph, useful for queries
const intMapping = {
  [ProposalTypes.Decision]: 2,
  [ProposalTypes.Proposal]: 1,
  [ProposalTypes.Suggestion]: 0,
}

export function convertFromString(str) {
  return symbolMapping[str]
}

export function convertToString(symbol) {
  return stringMapping[symbol]
}

export function convertToInt(symbol) {
  return intMapping[symbol]
}
