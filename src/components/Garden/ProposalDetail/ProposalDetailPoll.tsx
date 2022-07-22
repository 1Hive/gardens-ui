import { usePollProposals } from '@/hooks/usePollProposals'
import { ProposalType } from '@/types/app'
import { textStyle } from '@1hive/1hive-ui'
import React from 'react'
import styled from 'styled-components'
import { ConvictionBar } from '../ConvictionVisuals'

type ProposalDetailPollProps = {
  proposal: ProposalType
}

const Row = styled.div`
  width: 50%;
`

const ProposalDetailPoll = ({ proposal }: ProposalDetailPollProps) => {
  const [items, setItems] = React.useState<Array<ProposalType> | undefined>(
    undefined
  )
  const { fetchProposalsByProposalId } = usePollProposals()

  React.useEffect(() => {
    const fetch = async () => {
      const results = await fetchProposalsByProposalId(String(proposal.id))
      setItems(results)
    }

    items === undefined && fetch()
  }, [])

  return (
    <div>
      <label
        css={`
          ${textStyle('label1')};
          margin-bottom: 14px;
          display: block;
        `}
      >
        Poll Details
      </label>
      <div>
        {items &&
          items.map((item) => (
            <Row key={item.id}>
              <label
                css={`
                  ${textStyle('body1')};
                `}
              >
                <strong>{item.metadata}</strong>
              </label>
              <ConvictionBar proposal={item} withThreshold={false} />
            </Row>
          ))}
      </div>
    </div>
  )
}

export default ProposalDetailPoll
