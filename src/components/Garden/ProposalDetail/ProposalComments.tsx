import React from 'react'
import { GU, Split, useLayout } from '@1hive/1hive-ui'
import DiscourseComments from '@/components/DiscourseComments'

type ProposalCommentsProps = {
  link: string
}

function ProposalComments({ link }: ProposalCommentsProps) {
  const { layoutName } = useLayout()

  if (link) {
    // We take the topicId which usually is in the last section of the link if the penultimate is not a number
    const [lastParam, penultimate] = link.split('/').reverse()
    const discourseTopicId = Number(
      isNaN(+penultimate) ? lastParam : penultimate
    )

    return (
      <Split
        primary={
          <div
            css={`
              padding-left: ${layoutName !== 'large' ? 2 * GU : 0}px;
            `}
          >
            <DiscourseComments topicId={discourseTopicId} />
          </div>
        }
      />
    )
  }
  return <Split />
}

export default ProposalComments
