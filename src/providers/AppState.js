import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { providers as EthersProviders } from 'ethers'

import { ConvictionVoting } from '@1hive/connect-thegraph-conviction-voting'
import { connect } from '@aragon/connect'
import { useVaultBalance, useTokenBalances } from '../hooks/useAppHooks'

import { getDefaultChain } from '../local-settings'
import { transformProposalData, transformConfigData } from '../lib/data-utils'
import BigNumber from '../lib/bigNumber'
import { useWallet } from './Wallet'

const ORG_ADDRESS = '0x6a8b8891c5f6de1fcf1ab889e7a06f6b60431641'
const ORG_SUBRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/1hive/aragon-xdai'

const APP_NAME = 'conviction-voting'
const APP_SUBRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/1hive/aragon-conviction-voting-xdai'

const DEFAULT_APP_STATE = {
  organization: null,
  convictionApp: null,
  stakeToken: {},
  requestToken: {},
  proposals: [],
  convictionStakes: [],
  alpha: BigNumber(0),
  maxRatio: BigNumber(0),
  weight: BigNumber(0),
}

const AppStateContext = React.createContext()

function AppStateProvider({ children }) {
  const { account } = useWallet()
  const [appState, setAppState] = useState(DEFAULT_APP_STATE)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetchOrg = async () => {
      // Fetch the apps belonging to this organization. const apps = await org.apps()
      const organization = await connect(
        ORG_ADDRESS,
        [
          'thegraph',
          {
            orgSubgraphUrl: ORG_SUBRAPH_URL,
          },
        ],
        {
          readProvider: new EthersProviders.JsonRpcProvider(
            'https://xdai.poanetwork.dev/'
          ),
          chainId: getDefaultChain(),
        }
      )

      const apps = await organization.apps()

      const convictionApp = apps.find(app => app.name === APP_NAME)

      const conviction = new ConvictionVoting(
        convictionApp.address,
        APP_SUBRAPH_URL
      )

      const proposals = await conviction.proposals()
      const config = await conviction.config()

      if (!cancelled) {
        setLoading(false)
        setAppState(appState => ({
          ...appState,
          ...transformConfigData(config),
          installedApps: apps,
          convictionApp: conviction,
          organization,
          proposals: proposals.map(transformProposalData),
        }))
      }
    }

    setLoading(true)
    fetchOrg()

    return () => {
      cancelled = true
    }
  }, [])

  const vaultBalance = useVaultBalance(
    appState.installedApps,
    appState.requestToken
  )

  const stakeBalances = useTokenBalances(account, appState.stakeToken)

  return (
    <AppStateContext.Provider
      value={{
        ...appState,
        isLoading: loading,
        vaultBalance,
        accountBalance: stakeBalances.balance,
        totalSupply: stakeBalances.totalSupply,
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
