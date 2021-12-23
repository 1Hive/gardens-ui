import React, { useEffect } from 'react'

import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

const VoteOnDecision = React.memo(function VoteOnDecision({ getTransactions }) {
  const { next } = useMultiModal()

  useEffect(() => {
    getTransactions(() => {
      next()
    })
  }, [getTransactions, next])

  return <div />
})

export default VoteOnDecision
