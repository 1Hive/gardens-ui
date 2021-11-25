import React, { useCallback } from 'react'
import { useMultiModal } from '@components/MultiModal/MultiModalProvider'

import AccountModuleErrorScreen from '@/components/Account/ScreenError'

function ScreenErrorWrapper({ error, onBack }) {
  const { prev } = useMultiModal()

  const handleTryAgain = useCallback(() => {
    onBack()
    prev()
  }, [onBack, prev])

  return <AccountModuleErrorScreen error={error} onBack={handleTryAgain} />
}

export default ScreenErrorWrapper
