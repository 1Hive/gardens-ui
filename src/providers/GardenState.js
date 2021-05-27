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
import { getGardenTokenIcon } from '@utils/token-utils'

const GardenStateContext = React.createContext()

function GardenStateProvider({ children }) {
  const {
    config,
    errors,
    installedApps,
    loading: loadingGardenData,
    ...appData
  } = useGardenData()

  const [tokens, tokensLoading] = useTokens(config)

  const commonPool = useCommonPool(
    config?.conviction.vault,
    (tokens.wrappableToken || tokens.token).data
  )
  const effectiveSupply = useEffectiveSupply(tokens.token.totalSupply, config)
  const balancesLoading = commonPool.eq(-1) || tokensLoading
  const loading =
    (!errors && loadingGardenData) || balancesLoading || !effectiveSupply

  const newConfig = useNewConfig(config, effectiveSupply, loading, tokens)

  return (
    <GardenStateContext.Provider
      value={{
        ...appData,
        commonPool,
        config: newConfig,
        errors,
        installedApps,
        loading,
        mainToken: tokens.wrappableToken || tokens.token,
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
    useMemo(
      () => ({
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
      }),
      [
        gardenTokenAccountBalance,
        gardenTokenTotalSuuply,
        token,
        wrappableToken,
        wrappableTokenAccountBalance,
        wrappableTokenTotalSupply,
      ]
    ),

    loading,
  ]
}

function useNewConfig(config, effectiveSupply, loading, tokens) {
  return useMemo(() => {
    if (loading) {
      return null
    }

    const { requestToken, stableToken, stakeToken } = config.conviction

    // tokenIcons
    const requestTokenIcon = getGardenTokenIcon(tokens, requestToken)
    const stableTokenIcon = getGardenTokenIcon(tokens, stableToken)
    const stakeTokenIcon = getGardenTokenIcon(tokens, stakeToken)

    const tokensWithIcon = {
      requestToken: { ...requestToken, icon: requestTokenIcon },
      stableToken: { ...stableToken, icon: stableTokenIcon },
      stakeToken: { ...stakeToken, icon: stakeTokenIcon },
    }

    return {
      ...config,
      conviction: {
        ...config.conviction,
        ...tokensWithIcon,
        effectiveSupply,
      },
    }
  }, [config, effectiveSupply, loading, tokens])
}

GardenStateProvider.propTypes = {
  children: PropTypes.node,
}

function useGardenState() {
  return useContext(GardenStateContext)
}

export { GardenStateProvider, useGardenState }
