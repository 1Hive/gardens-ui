import { useEffect, useState } from 'react'

import { useWallet } from '@/providers/Wallet'
import { getNetwork } from '@/networks'

// Modified hooks took from web3-react: https://github.com/NoahZinsmeister/web3-react/blob/bb39007501da7aad4b3f7bd3eab2805c200d0c1b/example/hooks.ts

export function useEagerConnect() {
  const { _web3ReactContext, connectors } = useWallet()
  const { activate, active } = _web3ReactContext()
  const injected = connectors.injected.web3ReactConnector({
    chainId: getNetwork().chainId,
  })
  const [tried, setTried] = useState(false)

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, [activate, injected]) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true)
    }
  }, [active])

  return tried
}

// TODO: review  in details how to use it
// Use for network and injected - logs user inand out after checking what network theyre on
export function useInactiveListener(suppress = false) {
  const { _web3ReactContext, connectors } = useWallet()
  const { activate, active, error } = _web3ReactContext()
  const injected = connectors.injected.web3ReactConnector({
    chainId: getNetwork().chainId,
  })

  useEffect(() => {
    const { ethereum } = window

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch(error => {
          console.error('Failed to activate after chain changed', error)
        })
      }

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch(error => {
            console.error('Failed to activate after accounts changed', error)
          })
        }
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
    return undefined
  }, [active, error, suppress, activate, injected])
}
