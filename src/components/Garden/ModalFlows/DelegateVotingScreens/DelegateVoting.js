import React, { useCallback, useState } from 'react'
import { Button, isAddress, TextInput } from '@1hive/1hive-ui'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'
import { ZERO_ADDR } from '@/constants'

const DelegateVoting = React.memo(function DelegateVoting({ getTransactions }) {
  const { next } = useMultiModal()

  const [representative, setRepresentative] = useState('')
  const handleRepresentativeChange = useCallback(event => {
    setRepresentative(event.target.value)
  }, [])

  // Form submit handler
  const handleSubmit = useCallback(
    event => {
      event.preventDefault()

      getTransactions(() => {
        next()
      }, representative || ZERO_ADDR)
    },
    [getTransactions, next, representative]
  )

  // TODO: Add validation for setting own account as represnetative
  return (
    <form onSubmit={handleSubmit}>
      <div>Paste your delegate address</div>
      <div>
        <TextInput
          value={representative}
          onChange={handleRepresentativeChange}
          wide
        />
      </div>

      <Button
        label="Delegate"
        wide
        type="submit"
        mode="strong"
        disabled={representative && !isAddress(representative)}
      />
    </form>
  )
})

export default DelegateVoting
