import React, { useContext } from 'react'
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
  const effectiveSupply = useEffectiveSupply(totalSupply, config) // TODO: move to compoentns that use them

  const balancesLoading = vaultBalance.eq(-1) || totalSupply.eq(-1)
  const gardenLoading =
    (!errors && loadingGardenData) || balancesLoading || !effectiveSupply

  return (
    <GardenStateContext.Provider
      value={{
        ...appData,
        accountBalance: balance,
        config,
        effectiveSupply,
        errors,
        installedApps,
        loading: gardenLoading,
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
