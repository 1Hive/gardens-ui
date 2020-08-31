import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import {
  useVaultBalance,
  useTokenBalances,
  useOrganzation,
  useAppData,
} from '../hooks/useOrgHooks'
import { useWallet } from './Wallet'
import { STAKE_PCT_BASE } from '../constants'

const AppStateContext = React.createContext()

function AppStateProvider({ children }) {
  const { account } = useWallet()
  const organization = useOrganzation()
  const {
    convictionVoting,
    installedApps,
    minThresholdStakePercentage,
    requestToken,
    stakeToken,
    totalStaked,
    ...appData
  } = useAppData(organization)

  const vaultBalance = useVaultBalance(installedApps, requestToken)

  const { balance, totalSupply } = useTokenBalances(account, stakeToken)

  const effectiveSupply = useMemo(() => {
    if (!(totalSupply && totalStaked && minThresholdStakePercentage)) {
      return
    }
    const percentageOfTotalSupply = totalSupply
      .multipliedBy(minThresholdStakePercentage)
      .div(STAKE_PCT_BASE)

    if (totalStaked.lt(percentageOfTotalSupply)) {
      return percentageOfTotalSupply
    }
    return totalStaked
  }, [totalSupply, totalStaked, minThresholdStakePercentage])

  const balancesLoading = vaultBalance.eq(-1) || totalSupply.eq(-1)
  const appLoading = !convictionVoting || balancesLoading || !effectiveSupply

  return (
    <AppStateContext.Provider
      value={{
        ...appData,
        accountBalance: balance,
        convictionVoting,
        effectiveSupply,
        installedApps,
        isLoading: appLoading,
        requestToken,
        stakeToken,
        totalStaked,
        totalSupply: totalSupply,
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
