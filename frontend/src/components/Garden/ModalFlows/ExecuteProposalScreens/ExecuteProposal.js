import React, { useCallback } from 'react'
import { Button } from '@1hive/1hive-ui'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

const ExecuteProposal = React.memo(function ExecuteProposal({
  getTransactions,
}) {
  const { next } = useMultiModal()

  // Form submit handler
  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      getTransactions(() => {
        next()
      })
    },
    [getTransactions, next]
  )

  return (
    <form onSubmit={handleSubmit}>
      <Button label="Execute this proposal" wide type="submit" mode="strong" />
    </form>
  )
})

export default ExecuteProposal
