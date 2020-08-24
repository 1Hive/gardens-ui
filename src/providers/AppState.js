import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import {
  useVaultBalance,
  useTokenBalances,
  useOrganzation,
  useAppData,
} from '../hooks/useOrgHooks'
import { useWallet } from './Wallet'

const AppStateContext = React.createContext()

function AppStateProvider({ children }) {
  const { account } = useWallet()
  const organization = useOrganzation()
  const {
    convictionVoting,
    installedApps,
    requestToken,
    stakeToken,
    totalStaked,
    minThresholdStakePercentage,
    pctBase,
    ...appData
  } = useAppData(organization)

  const vaultBalance = useVaultBalance(installedApps, requestToken)

  const { balance, totalSupply } = useTokenBalances(account, stakeToken)

  const effectiveSupply = useMemo(() => {
    if (
      !(totalSupply && totalStaked && minThresholdStakePercentage && pctBase)
    ) {
      return
    }
    const percentageOfTotalSupply = totalSupply
      .multipliedBy(minThresholdStakePercentage)
      .div(1)

    if (totalStaked.lt(percentageOfTotalSupply)) {
      return percentageOfTotalSupply
    }
    return totalStaked
  }, [totalSupply, totalStaked, minThresholdStakePercentage, pctBase])

  const balancesLoading = vaultBalance.eq(-1) || totalSupply.eq(-1)
  const appLoading = !convictionVoting || balancesLoading || !effectiveSupply

  return (
    <AppStateContext.Provider
      value={{
        ...appData,
        accountBalance: balance,
        convictionVoting,
        installedApps,
        isLoading: appLoading,
        requestToken,
        stakeToken,
        totalSupply: totalSupply,
        vaultBalance,
        totalStaked,
        effectiveSupply,
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
