import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import {
  useVaultBalance,
  useTokenBalances,
  useOrganzation,
  useAppData,
} from '../hooks/useAppHooks'
import { useWallet } from './Wallet'

const AppStateContext = React.createContext()

function AppStateProvider({ children }) {
  const { account } = useWallet()
  const organization = useOrganzation()
  const appData = useAppData(organization)

  const vaultBalance = useVaultBalance(
    appData.installedApps,
    appData.requestToken
  )

  const { balance, totalSupply } = useTokenBalances(account, appData.stakeToken)

  const balancesLoading = vaultBalance.eq(-1) || totalSupply.eq(-1)
  const appLoading = !appData.convictionVoting || balancesLoading

  return (
    <AppStateContext.Provider
      value={{
        ...appData,
        isLoading: appLoading,
        vaultBalance,
        accountBalance: balance,
        totalSupply: totalSupply,
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
