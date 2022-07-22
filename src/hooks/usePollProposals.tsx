import { getNetwork } from '@/networks'
import { ProposalTypes } from '@/types'
import { ProposalType } from '@/types/app'
import React from 'react'
import { Client, gql } from 'urql'

import useProposalFilters from './useProposalFilters'
import { useProposalsWithCustomFilters } from './useProposals'

const QUERY = gql`
  query MyQuery {
    proposals(where: { type: Suggestion, metadata_starts_with: "Poll -" }) {
      metadata
      number
    }
  }
`

const QUERY_BY_ID = gql`
  query CourtConfig($id: String!) {
    proposals(where: { type: Suggestion, metadata_starts_with_nocase: $id }) {
      metadata
      number
    }
  }
`

export function usePollProposals(chainId: number) {
  const [pollProposals, setPollProposals] = React.useState<Array<string>>([])
  const network = getNetwork(chainId)

  const graphqlClient = new Client({
    url: network.subgraphs.gardens,
  })

  const fetchProposalsByProposalId = async (id: string) => {
    const result = await graphqlClient
      .query(QUERY_BY_ID, { id: `Poll ${id} -` })
      .toPromise()

    if (!result?.data) {
      return []
    }

    return result?.data?.proposals ?? []
  }

  React.useEffect(() => {
    async function fetch() {
      const result = await graphqlClient.query(QUERY).toPromise()

      if (!result?.data) {
        return
      }

      setPollProposals(result?.data?.proposals)
    }

    pollProposals.length === 0 && fetch()
  }, [graphqlClient])

  return {
    pollProposals,
    fetchProposalsByProposalId,
  }
}
