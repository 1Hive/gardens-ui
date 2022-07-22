import { usePollProposals } from '@/hooks/usePollProposals'
import { ProposalType } from '@/types/app'
import React from 'react'
import { ConvictionBar } from '../ConvictionVisuals'

type ProposalDetailPollProps = {
  proposal: ProposalType
  chainId: any
}

const ProposalDetailPoll = ({ proposal, chainId }: ProposalDetailPollProps) => {
  const [items, setItems] = React.useState<Array<ProposalType> | undefined>(
    undefined
  )
  const { fetchProposalsByProposalId } = usePollProposals(chainId)

  React.useEffect(() => {
    const fetch = async () => {
      const results = await fetchProposalsByProposalId(String(proposal.id))
      setItems(results)
    }

    items === undefined && fetch()
  }, [])

  return (
    <div>
      <label>Poll Details</label>
      <div>
        {items &&
          items.map((item) => (
            <div key={item.id}>
              <label>{item.metadata}</label>
              <ConvictionBar proposal={item} withThreshold={false} />
            </div>
          ))}
      </div>
    </div>
  )
}

export default ProposalDetailPoll
