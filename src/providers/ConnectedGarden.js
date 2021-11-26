import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { getGarden } from '@1hive/connect-gardens'

import { ActivityProvider } from './ActivityProvider'
import { AgreementSubscriptionProvider } from './AgreementSubscription'
import { ConnectProvider as Connect } from './Connect'
import { GardenStateProvider } from './GardenState'
import { StakingProvider } from './Staking'

import { useGardens } from './Gardens'
import { useMounted } from '@hooks/useMounted'
import { useWallet } from './Wallet'

import { DAONotFound } from '../errors'
import { mergeGardenMetadata } from '@utils/garden-utils'
import { getNetwork } from '@/networks'

const ConnectedGardenContext = React.createContext()

export function ConnectedGardenProvider({ children }) {
  const match = useRouteMatch('/garden/:daoId')
  const gardenAddress = match?.params.daoId

  if (gardenAddress) {
    return <WithGarden gardenAddress={gardenAddress}>{children}</WithGarden>
  }

  return (
    <ConnectedGardenContext.Provider value={null}>
      {children}
    </ConnectedGardenContext.Provider>
  )
}

function WithGarden({ children, gardenAddress }) {
  const { preferredNetwork } = useWallet()
  const { gardensMetadata } = useGardens()
  const [connectedGarden, connectedGardenLoading] = useGarden(
    gardenAddress,
    gardensMetadata,
    preferredNetwork
  )

  if (!connectedGarden && !connectedGardenLoading) {
    throw new DAONotFound(gardenAddress)
  }

  return (
    <ConnectedGardenContext.Provider value={connectedGarden}>
      {connectedGarden ? (
        <Connect>
          <ActivityProvider>
            <GardenStateProvider>
              <StakingProvider>
                <AgreementSubscriptionProvider>
                  {children}
                </AgreementSubscriptionProvider>
              </StakingProvider>
            </GardenStateProvider>
          </ActivityProvider>
        </Connect>
      ) : (
        children
      )}
    </ConnectedGardenContext.Provider>
  )
}

export function useConnectedGarden() {
  return useContext(ConnectedGardenContext)
}

function useGarden(id, gardensMetadata, chainId) {
  const [garden, setGarden] = useState(null)
  const [loading, setLoading] = useState(true)
  const mounted = useMounted()

  const { subgraphs } = getNetwork(chainId)

  useEffect(() => {
    if (!id) {
      if (mounted()) {
        setLoading(false)
      }
      return
    }
    const fetchGarden = async () => {
      if (mounted()) {
        setLoading(true)
      }
      try {
        const result = await getGarden(
          { network: chainId, subgraphUrl: subgraphs.gardens },
          id
        )

        if (mounted()) {
          setGarden(mergeGardenMetadata(result, gardensMetadata))
        }
      } catch (err) {
        if (mounted()) {
          setGarden(null)
        }
        console.error(err)
      }

      if (mounted()) {
        setLoading(false)
      }
    }

    fetchGarden()
  }, [chainId, id, gardensMetadata, mounted, subgraphs.gardens])

  return [garden, loading]
}
