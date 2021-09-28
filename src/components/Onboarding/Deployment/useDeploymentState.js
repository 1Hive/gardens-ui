import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import { useWallet } from '@providers/Wallet'
import {
  STEP_ERROR,
  STEP_PROMPTING,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
} from '@components/Stepper/stepper-statuses'

const DEFAULT_TX_PROGRESS = {
  signed: 0,
  success: 0,
  errored: -1,
  hashes: [],
}

export default function useDeploymentState() {
  const { account, ethers } = useWallet()
  const { deployTransactions } = useOnboardingState()

  const [attempts, setAttempts] = useState(0)
  const [transactionProgress, setTransactionProgress] = useState(
    DEFAULT_TX_PROGRESS
  )

  const signer = useMemo(() => ethers.getSigner(), [ethers])

  // Call tx functions in the template, one after another.
  useEffect(() => {
    if (attempts === 0) {
      setTransactionProgress(DEFAULT_TX_PROGRESS)
    } else {
      setTransactionProgress(txProgress => ({ ...txProgress, errored: -1 }))
    }

    if (!deployTransactions.length > 0) {
      return
    }

    let cancelled = false
    const createTransactions = async () => {
      // Only process the next transaction after the previous one was successfully mined
      const remainingTransactions = deployTransactions.slice(
        transactionProgress.success
      )
      for (const deployTransaction of remainingTransactions) {
        let { transaction } = deployTransaction
        transaction = {
          ...transaction,
          from: account,
        }

        try {
          if (!cancelled) {
            const tx = await signer.sendTransaction(transaction)

            setTransactionProgress(({ signed, hashes, ...txProgress }) => ({
              ...txProgress,
              signed: signed + 1,
              hashes: [...hashes, tx.hash],
            }))

            await tx.wait()

            setTransactionProgress(({ success, ...txProgress }) => ({
              ...txProgress,
              success: success + 1,
            }))
          }
        } catch (err) {
          console.error('Failed onboarding transaction', err)
          if (!cancelled) {
            setTransactionProgress(({ success, ...txProgress }) => ({
              ...txProgress,
              errored: success,
              success,
            }))
          }

          // Re-throw error to stop later transactions from being signed
          throw err
        }
      }
    }
    createTransactions()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, attempts, deployTransactions])

  // Statuses
  const transactionsStatus = useMemo(() => {
    if (!deployTransactions) {
      return []
    }

    const { signed, success, errored } = transactionProgress
    const status = index => {
      if (errored !== -1 && index >= errored) {
        return STEP_ERROR
      }
      if (index === signed) {
        return STEP_PROMPTING
      }
      if (index < signed) {
        if (index === success) {
          return STEP_WORKING
        }
        return STEP_SUCCESS
      }
      return STEP_WAITING
    }

    return deployTransactions.map(({ name }, index) => ({
      name,
      status: status(index),
    }))
  }, [deployTransactions, transactionProgress])

  const handleNextAttempt = useCallback(() => setAttempts(a => a + 1), [])

  return {
    erroredTransactions: transactionProgress.errored,
    onNextAttempt: handleNextAttempt,
    ready: deployTransactions.length > 0,
    transactionsStatus,
  }
}
