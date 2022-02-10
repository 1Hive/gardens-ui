import { useCallback, useState } from 'react'
import { useWallet } from '@providers/Wallet'

function useWalletError() {
  const [error, setError] = useState(null)
  const { resetConnection } = useWallet()

  const handleOnError = useCallback((e) => {
    setError(e)
  }, [])

  const handleTryAgain = useCallback(() => {
    resetConnection()
    setError(null)
  }, [resetConnection])

  return { error, handleOnError, handleTryAgain }
}

export default useWalletError
