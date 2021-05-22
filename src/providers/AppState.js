import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { useWallet } from '@providers/Wallet'
import {
  useOrgData,
  useTokenBalances,
  useVaultBalance,
} from '@hooks/useOrgHooks'
import { useGardens } from '@providers/Gardens'
import useEffectiveSupply from '@hooks/useEffectiveSupply'

const AppStateContext = React.createContext()

function AppStateProvider({ children }) {
  const {
    config,
    errors,
    installedApps,
    loadingAppData,
    ...appData
  } = useOrgData()

  const { account } = useWallet()
  const {
    connectedGarden: { wrappableToken },
  } = useGardens()
  const { requestToken, stableToken, stakeToken, totalStaked } =
    config?.conviction || {}

  const { balance, totalSupply } = useTokenBalances(account, stakeToken)
  const { balance: wrappableTokenBalance } = useTokenBalances(
    account,
    wrappableToken
  )
  const vaultBalance = useVaultBalance(installedApps, requestToken)
  const effectiveSupply = useEffectiveSupply(totalSupply, config)

  const balancesLoading = vaultBalance.eq(-1) || totalSupply.eq(-1)

  const appLoading =
    (!errors && loadingAppData) || balancesLoading || !effectiveSupply

  return (
    <AppStateContext.Provider
      value={{
        ...appData,
        accountBalance: balance,
        config,
        effectiveSupply,
        errors,
        installedApps,
        isLoading: appLoading,
        requestToken,
        stableToken,
        stakeToken,
        totalStaked,
        totalSupply,
        vaultBalance,
        wrappableAccountBalance: wrappableTokenBalance,
        wrappableToken, // TODO- do a reorder here, use an object for every token with the account balance for that tokens
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

AppStateProvider.propTypes = {
  children: PropTypes.node,
}

function useAppState() {
  return useContext(AppStateContext)
}

export { AppStateProvider, useAppState }
