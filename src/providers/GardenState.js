import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useWallet } from '@providers/Wallet'
import {
  useCommonPool,
  useGardenData,
  useTokenBalances,
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

  const [tokens, tokensLoading] = useTokens()

  const commonPool = useCommonPool(
    config?.conviction.vault,
    (tokens.wrappableToken || tokens.token).data
  )
  const effectiveSupply = useEffectiveSupply(tokens.token.totalSupply, config)
  const balancesLoading = commonPool.eq(-1) || tokensLoading

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
        commonPool,
        config: newConfig,
        errors,
        installedApps,
        loading,
        ...tokens,
      }}
    >
      {children}
    </GardenStateContext.Provider>
  )
}

function useTokens() {
  const { account } = useWallet()
  const { connectedGarden } = useGardens()
  const { token, wrappableToken } = connectedGarden

  const {
    balance: gardenTokenAccountBalance,
    totalSupply: gardenTokenTotalSuuply,
  } = useTokenBalances(account, token)
  const {
    balance: wrappableTokenAccountBalance,
    totalSupply: wrappableTokenTotalSupply,
  } = useTokenBalances(account, wrappableToken)

  const loading =
    gardenTokenTotalSuuply.eq(-1) &&
    wrappableToken &&
    wrappableTokenTotalSupply.eq(-1)

  return [
    {
      token: {
        accountBalance: gardenTokenAccountBalance,
        data: token,
        totalSupply: gardenTokenTotalSuuply,
      },
      wrappableToken: wrappableToken
        ? {
            accountBalance: wrappableTokenAccountBalance,
            data: wrappableToken,
            totalSupply: wrappableTokenTotalSupply,
          }
        : null,
    },
    loading,
  ]
}

GardenStateProvider.propTypes = {
  children: PropTypes.node,
}

function useGardenState() {
  return useContext(GardenStateContext)
}

export { GardenStateProvider, useGardenState }
