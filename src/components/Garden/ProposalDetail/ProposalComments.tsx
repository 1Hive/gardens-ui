import React from 'react'
import { GU, Split, useLayout } from '@1hive/1hive-ui'
import DiscourseComments from '@/components/DiscourseComments'

type ProposalCommentsProps = {
  link: string
}

function ProposalComments({ link }: ProposalCommentsProps) {
  const { layoutName } = useLayout()
  

  // We take the last section of the link that includes the topicId
  const discourseTopicId = link.split('/').reverse()[0]

  return (
    <Split
      primary={
        link && (
          <div
            css={`
              padding-left: ${layoutName !== 'large' ? 2 * GU : 0}px;
            `}
          >
            <DiscourseComments {...{ topicId: discourseTopicId }} />
          </div>
        )
      }
    />
  )
}

export default ProposalComments
