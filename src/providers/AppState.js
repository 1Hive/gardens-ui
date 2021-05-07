import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { useOrgData, useVaultBalance } from '../hooks/useOrgHooks'
import useEffectiveSupply from '../hooks/useEffectiveSupply'
import { useGardens } from './Gardens'

const AppStateContext = React.createContext()

function AppStateProvider({ children }) {
  const {
    config,
    errors,
    installedApps,
    loadingAppData,
    ...appData
  } = useOrgData()
  const {
    connectedGarden: { accountBalance, totalSupply },
  } = useGardens() // TODO: Move to useOrgData

  const { requestToken, stableToken, stakeToken, totalStaked } =
    config?.conviction || {}

  const vaultBalance = useVaultBalance(installedApps, requestToken)
  const effectiveSupply = useEffectiveSupply(totalSupply, config)

  const balancesLoading = vaultBalance.eq(-1) || totalSupply.eq(-1)

  const appLoading =
    (!errors && loadingAppData) || balancesLoading || !effectiveSupply

  return (
    <AppStateContext.Provider
      value={{
        ...appData,
        accountBalance,
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
