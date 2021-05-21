import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useWallet } from '@providers/Wallet'
import {
  useGardenData,
  useTokenBalances,
  useVaultBalance,
} from '@hooks/useGardenHooks'
import { useGardens } from '@providers/Gardens'
import useEffectiveSupply from '@hooks/useEffectiveSupply'

const GardenStateContext = React.createContext()

function GardenStateProvider({ children }) {
  const {
    config,
    errors,
    installedApps,
    loading: loadingGardenData,
    ...appData
  } = useGardenData()

  const { account } = useWallet()
  const { connectedGarden } = useGardens()
  const { token, wrappableToken } = connectedGarden
  const { requestToken, stakeToken } = config?.conviction || {}

  const { balance, totalSupply } = useTokenBalances(account, stakeToken)
  const { balance: wrappableTokenBalance } = useTokenBalances(
    account,
    wrappableToken
  )
  const vaultBalance = useVaultBalance(installedApps, requestToken)
  const effectiveSupply = useEffectiveSupply(totalSupply, config)
  const balancesLoading = vaultBalance.eq(-1) || totalSupply.eq(-1)

  const [newConfig, loading] = useMemo(() => {
    if ((!errors && loadingGardenData) || balancesLoading || !effectiveSupply) {
      return [null, true]
    }

    return [
      { ...config, conviction: { ...config.conviction, effectiveSupply } },
      false,
    ]
  }, [balancesLoading, config, effectiveSupply, errors, loadingGardenData])

  return (
    <GardenStateContext.Provider
      value={{
        ...appData,
        accountBalance: balance,
        config: newConfig,
        errors,
        installedApps,
        loading,
        token,
        totalSupply,
        vaultBalance,
        wrappableAccountBalance: wrappableTokenBalance,
        wrappableToken, // TODO- do a reorder here, use an object for every token with the account balance for that tokens
      }}
    >
      {children}
    </GardenStateContext.Provider>
  )
}

GardenStateProvider.propTypes = {
  children: PropTypes.node,
}

function useGardenState() {
  return useContext(GardenStateContext)
}

export { GardenStateProvider, useGardenState }
