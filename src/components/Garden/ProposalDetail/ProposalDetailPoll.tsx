import { usePollProposals } from '@/hooks/usePollProposals'
import { ProposalType } from '@/types/app'
import { dateFormat } from '@/utils/date-utils'
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
      <div
        css={`
          margin-bottom: 24px;
          display: block;
        `}
      >
        <label
          css={`
            ${textStyle('label1')};
            margin-bottom: 14px;
            display: block;
            text-transform: normal;
          `}
        >
          Snapshot Date:{' '}
          <span
            css={`
              ${textStyle('body3')};
              margin-left: 14px;
            `}
          >
            {dateFormat(proposal.createdAt, 'custom')}
          </span>
        </label>
      </div>

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
          {items ? (
            items.length === 0 ? (
              <p>No suggestion associated with this Poll.</p>
            ) : (
              items.map((item) => (
                <Row key={item.id}>
                  <label
                    css={`
                      ${textStyle('body2')};
                    `}
                  >
                    {item.metadata}
                  </label>
                  <ConvictionBar proposal={item} withThreshold={false} />
                </Row>
              ))
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ProposalDetailPoll
