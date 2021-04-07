import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import {
  useOrgData,
  useTokenBalances,
  useVaultBalance,
} from '../hooks/useOrgHooks'
import useEffectiveSupply from '../hooks/useEffectiveSupply'
import { useWallet } from './Wallet'

const AppStateContext = React.createContext()

function AppStateProvider({ children }) {
  const { account } = useWallet()

  const {
    config,
    errors,
    installedApps,
    loadingAppData,
    ...appData
  } = useOrgData()

  const { requestToken, stableToken, stakeToken, totalStaked } =
    config?.conviction || {}

  const vaultBalance = useVaultBalance(installedApps, requestToken)
  const { balance, totalSupply } = useTokenBalances(account, stakeToken)
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
