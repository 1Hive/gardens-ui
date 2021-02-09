import React from 'react'
import { Button, GU } from '@1hive/1hive-ui'
import LoadingSpinner from '../LoadingRing'

function ModalButton({ children, loading, ...props }) {
  return (
    <Button
      mode="strong"
      wide
      css={`
        margin-top: ${2 * GU}px;
      `}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          css={`
            margin-right: ${1 * GU}px;
          `}
        />
      )}
      {loading ? 'Loading…' : children}
    </Button>
  )
}

export default ModalButton
