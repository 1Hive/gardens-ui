import { getNetwork } from '@/networks'
import { useConnectedGarden } from '@/providers/ConnectedGarden'
import { useGardenState } from '@/providers/GardenState'
import { transformConvictionProposalData } from '@/utils/data-utils'

import React from 'react'
import { Client, gql } from 'urql'
import { useWallet } from 'use-wallet'
import { useLatestBlock } from './useBlock'
import { processProposal } from './useProposals'

export function usePollProposals() {
  const { account } = useWallet()
  const { chainId } = useConnectedGarden()
  const [pollProposals, setPollProposals] = React.useState<Array<string>>([])
  const network = getNetwork(chainId)
  const latestBlock = useLatestBlock(chainId)
  const { loading, config } = useGardenState()

  const graphqlClient = new Client({
    url: network.subgraphs.gardens,
  })

  const fetchProposalsByProposalId = async (id: string) => {
    console.log(`fetchProposalsByProposalId`)

    const result = await graphqlClient
      .query(
        gql`
          query CourtConfig($id: String!) {
            proposals(
              where: { type: Suggestion, metadata_starts_with_nocase: $id }
            ) {
              metadata
              number
              type
              stakes {
                id
                amount
                createdAt
                proposal
              }
              stakesHistory {
                id
                conviction
                createdAt
                tokensStaked
                totalTokensStaked
                proposal {
                  id
                  metadata
                  number
                  type
                }
              }
              totalTokensStaked
            }
          }
        `,
        { id: `Poll ${id} -` }
      )
      .toPromise()

    if (loading || !result?.data) {
      return []
    }

    const proposals = result?.data?.proposals.map((proposal: any) =>
      processProposal(
        {
          ...proposal,
          ...transformConvictionProposalData(proposal),
        },
        latestBlock,
        account,
        config.conviction
      )
    )

    console.log({ proposals })

    return proposals ?? []
  }

  React.useEffect(() => {
    async function fetch() {
      const result = await graphqlClient
        .query(
          gql`
            query MyQuery {
              proposals(
                where: { type: Suggestion, metadata_starts_with: "Poll -" }
              ) {
                metadata
                number
              }
            }
          `
        )
        .toPromise()

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
