import React, { useContext, useEffect, useState } from 'react'
import { getGarden } from '@1hive/connect-gardens'

import { ActivityProvider } from './ActivityProvider'
import { AgreementSubscriptionProvider } from './AgreementSubscription'
import { ConnectProvider as Connect } from './Connect'
import { GardenStateProvider } from './GardenState'
import { StakingProvider } from './Staking'

import { useGardens } from './Gardens'
import { useGardenRoute } from '@hooks/useRouting'
import { useMounted } from '@hooks/useMounted'

import { DAONotFound } from '../errors'
import { mergeGardenMetadata } from '@utils/garden-utils'
import { getNetwork, getNetworkChainIdByType } from '@/networks'

const ConnectedGardenContext = React.createContext()

export function ConnectedGardenProvider({ children }) {
  const [networkType, gardenAddress] = useGardenRoute()
  const chainId = getNetworkChainIdByType(networkType)

  if (gardenAddress && chainId) {
    return (
      <WithGarden gardenAddress={gardenAddress} chainId={chainId}>
        {children}
      </WithGarden>
    )
  }

  return (
    <ConnectedGardenContext.Provider value={null}>
      {children}
    </ConnectedGardenContext.Provider>
  )
}

function WithGarden({ children, gardenAddress, chainId }) {
  const { gardensMetadata } = useGardens()
  const [connectedGarden, connectedGardenLoading] = useGarden(
    gardenAddress,
    gardensMetadata,
    chainId
  )

  if (!connectedGarden && !connectedGardenLoading) {
    throw new DAONotFound(gardenAddress, chainId)
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
          setGarden({
            ...mergeGardenMetadata(result, gardensMetadata),
            chainId,
          })
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

export const getGardenData = async (address, chainId) => {
  const { subgraphs } = getNetwork(chainId)

  try {
    const result = await getGarden(
      { network: chainId, subgraphUrl: subgraphs.gardens },
      address
    )

    return result
  } catch (err) {
    return null
  }
}
