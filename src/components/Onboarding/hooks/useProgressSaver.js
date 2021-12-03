import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@providers/Wallet'

import {
  getItem,
  recoverAssets,
  removeItem,
  setItem,
} from '../utils/progress-utils'

export default function useProgressSaver(onConfigChange, onStepChange) {
  const { account } = useWallet()
  const [resumed, setResumed] = useState(false)

  const handleClearProgress = useCallback(() => {
    removeItem(account)
  }, [account])

  const handleResume = useCallback(() => {
    setResumed(true)
  }, [])

  const handleSaveConfig = useCallback(
    config => {
      const progress = getItem(account)
      setItem(account, { ...progress, config })
    },
    [account]
  )

  const handleSaveStep = useCallback(
    step => {
      const progress = getItem(account)
      setItem(account, { ...progress, step })
    },
    [account]
  )

  useEffect(() => {
    if (!resumed) {
      return
    }

    const progress = getItem(account)
    if (progress) {
      onConfigChange(recoverAssets(progress.config))
      onStepChange(progress.step)
    }
  }, [account, onConfigChange, onStepChange, resumed])

  return {
    hasSavedProgress: Boolean(getItem(account)),
    onClearProgress: handleClearProgress,
    onResume: handleResume,
    onSaveConfig: handleSaveConfig,
    onSaveStep: handleSaveStep,
    resumed,
  }
}
