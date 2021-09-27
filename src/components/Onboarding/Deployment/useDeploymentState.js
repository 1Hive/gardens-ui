import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOnboardingState } from '@providers/Onboarding'
import { useWallet } from '@providers/Wallet'
import {
  STEP_ERROR,
  STEP_SUCCESS,
  STEP_WAITING,
  STEP_WORKING,
} from '@components/Stepper/stepper-statuses'

const DEFAULT_TX_PROGRESS = {
  signing: 0,
  success: 0,
  error: -1,
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
      deployTransactions
        // If we're retrying, only retry from the last success one
        .slice(transactionProgress.success)
        .reduce(async (deployPromise, { transaction }) => {
          // Wait for the previous promise; if component has unmounted, don't progress any further
          await deployPromise

          transaction = {
            ...transaction,
            from: account,
          }

          try {
            if (!cancelled) {
              const tx = await signer.sendTransaction(transaction)

              setTransactionProgress(({ signed, hashes, ...txProgress }) => ({
                signed: signed + 1,
                hashes: [...hashes, tx.hash],
                ...txProgress,
              }))

              await tx.wait()

              setTransactionProgress(({ success, ...txProgress }) => ({
                success: success + 1,
                ...txProgress,
              }))
            }
          } catch (err) {
            console.error('Failed onboarding transaction', err)
            if (!cancelled) {
              setTransactionProgress(({ success, ...txProgress }) => ({
                errored: success,
                success,
                ...txProgress,
              }))
            }

            // Re-throw error to stop later transactions from being signed
            throw err
          }
        }, Promise.resolve())
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

    const { signed, errored } = transactionProgress
    const status = index => {
      if (errored !== -1 && index >= errored) {
        return STEP_ERROR
      }
      if (index === signed) {
        return STEP_WORKING
      }
      if (index < signed) {
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
    transactionsStatus,
    onNextAttempt: handleNextAttempt,
  }
}
