import React, { useEffect } from 'react'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

const PriceOracle = React.memo(function ExecuteProposal({ getTransactions }) {
  const { next } = useMultiModal()

  useEffect(() => {
    getTransactions(() => {
      next()
    })
  }, [getTransactions, next])

  return <div />
})

export default PriceOracle
