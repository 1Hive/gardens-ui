import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import {
  useOrgData,
  useTokenBalances,
  useVaultBalance,
} from '../hooks/useOrgHooks'
import useEffectiveSupply from '../hooks/useEffectiveSupply'
import { useWallet } from './Wallet'

const GardenStateContext = React.createContext()

function GardenStateProvider({ children }) {
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
    <GardenStateContext.Provider
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
