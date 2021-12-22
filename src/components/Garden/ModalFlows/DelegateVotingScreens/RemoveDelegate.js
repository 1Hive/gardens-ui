import React, { useEffect } from 'react'

import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

import { ZERO_ADDR } from '@/constants'

const RemoveDelegate = React.memo(function RemoveDelegate({ getTransactions }) {
  const { next } = useMultiModal()

  useEffect(() => {
    getTransactions(() => {
      next()
    }, ZERO_ADDR)
  }, [getTransactions, next])

  return <div />
})

export default RemoveDelegate
