import React, { useContext, useMemo } from 'react'

import PropTypes from 'prop-types'

import { useWallet } from '@providers/Wallet'

import useEffectiveSupply from '@hooks/useEffectiveSupply'
import {
  useCommonPool,
  useGardenData,
  useTokenBalances,
} from '@hooks/useGardenHooks'

import { getGardenTokenIcon } from '@utils/token-utils'

import { useConnectedGarden } from './ConnectedGarden'

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
    config?.conviction.fundsManager,
    config?.conviction.requestToken
  )
  const effectiveSupply = useEffectiveSupply(tokens.token.totalSupply, config)

  // loading states
  const balancesLoading = commonPool.eq(-1) || tokensLoading
  const loading = loadingGardenData || balancesLoading || !effectiveSupply

  // transform config
  const newConfig = useNewConfig(config, effectiveSupply, loading)

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
  const { token, wrappableToken } = useConnectedGarden()

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

function useNewConfig(config, effectiveSupply, loading) {
  const connectedGarden = useConnectedGarden()

  return useMemo(() => {
    if (loading) {
      return null
    }

    const { requestToken, stableToken, stakeToken } = config.conviction

    // tokenIcons
    const requestTokenIcon = getGardenTokenIcon(connectedGarden, requestToken)
    const stableTokenIcon = getGardenTokenIcon(connectedGarden, stableToken)
    const stakeTokenIcon = getGardenTokenIcon(connectedGarden, stakeToken)

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
  }, [config, connectedGarden, effectiveSupply, loading])
}

GardenStateProvider.propTypes = {
  children: PropTypes.node,
}

function useGardenState() {
  return useContext(GardenStateContext)
}

export { GardenStateProvider, useGardenState }
