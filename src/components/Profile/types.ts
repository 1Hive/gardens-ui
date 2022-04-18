type ProposalType = {
  id: string
  name: string
  number: string
  status: string
  metadata: string
  type: 'PROPOSAL_TYPE_SUGGESTION'
  organization: {
    id: string
  }
}

type InactiveStake = {
  amount: any
  createdAt: number
  id: string
  proposal: ProposalType
  type: string
}

type UserType = {
  address: string
  gardensSigned: string[]
  id: string
  representativeFor: Array<{
    organization: { id: string }
    user: { id: string; address: string }
  }>
  supports: Array<{
    casts: Array<any>
    id: string
    organization: { id: string }
    representative: { id: string; address: string }
    stakes: Array<ProposalType>
    stakesHistory: Array<{
      conviction: any
      createdAt: number
      id: string
      proposal: ProposalType
      time: string
      tokensStaked: any
      totalTokensStaked: any
      type: string
    }>
    user: { id: string; address: string; __typename: 'User' }
  }>
}

export type { UserType, InactiveStake, ProposalType }
