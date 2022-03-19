import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@providers/Wallet'

import {
  getItem,
  recoverAssets,
  removeItem,
  setItem,
} from '../utils/progress-utils'

export default function useProgressSaver(
  onConfigChange: any,
  onStepChange: any
) {
  const { account, chainId } = useWallet()
  const [resumed, setResumed] = useState(false)

  const handleClearProgress = useCallback(() => {
    removeItem(account, chainId)
  }, [account, chainId])

  const handleResume = useCallback(() => {
    setResumed(true)
  }, [])

  const handleSaveConfig = useCallback(
    (config) => {
      const progress = getItem(account, chainId)
      setItem(account, chainId, { ...progress, config })
    },
    [account, chainId]
  )

  const handleSaveStep = useCallback(
    (step) => {
      const progress = getItem(account, chainId)
      setItem(account, chainId, { ...progress, step })
    },
    [account, chainId]
  )

  useEffect(() => {
    if (!resumed) {
      return
    }

    const progress = getItem(account, chainId)
    if (progress) {
      onConfigChange(recoverAssets(progress.config))
      onStepChange(progress.step)
    }
  }, [account, chainId, onConfigChange, onStepChange, resumed])

  return {
    hasSavedProgress: Boolean(getItem(account, chainId)),
    onClearProgress: handleClearProgress,
    onResume: handleResume,
    onSaveConfig: handleSaveConfig,
    onSaveStep: handleSaveStep,
    resumed,
  }
}
