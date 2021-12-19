import { useCallback, useEffect, useRef, useState } from 'react'
import { useGardenState } from '@providers/GardenState'
import {
  transformConfigData,
  transformProposalData,
  transformSupporterData,
} from '../utils/data-utils'

type Garden = {
  onConfig: any
}

export function useConfigSubscription(garden: Garden) {
  console.log(`useConfigSubscription`, garden)
  const [config, setConfig] = useState(null)

  const rawConfigRef = useRef<unknown>(null)
  const configSubscription = useRef<unknown>(null)

  const onConfigHandler = useCallback((err, config) => {
    if (err || !config) {
      return
    }

    const rawConfig = JSON.stringify(config)
    if (rawConfigRef.current === rawConfig) {
      return
    }

    rawConfigRef.current = rawConfig

    const transformedConfig = transformConfigData(config)
    setConfig(transformedConfig)
  }, [])

  useEffect(() => {
    if (!garden) {
      return
    }

    configSubscription.current = garden.onConfig(onConfigHandler)

    return () => {
      configSubscription.current = null
    }
  }, [garden, onConfigHandler])

  return config
}

type FiltersType = {
  count: {
    filter: number
    onChange: () => void
  }
  isActive: boolean
  name: {
    filter: string
    queryArgs: {
      metadata: string
    }
    onChange: (name: string) => void
  }
  onClear: () => void
  ranking: {
    items: Array<string>
    filter: number
    queryArgs: { orderBy: string }
    onChange: (index: any) => void
  }
  status: {
    items: Array<string>
    filter: number
    queryArgs: {
      statuses: Array<number>
    }
    onChange: (index: any) => void
  }
  support: {
    items: Array<string>
    filter: number
    onChange: () => void
  }
  type: {
    items: Array<string>
    filter: number
    queryArgs: any
    onChange: (index: any) => void
  }
  proposalCount?: any
}

export function useProposalsSubscription(filters: FiltersType) {
  const { config, connector } = useGardenState()
  const [proposals, setProposals] = useState<any[]>([])

  console.log(`useProposalsSubscription`, config)
  const proposalsSubscription = useRef(null)

  const onProposalsHandler = useCallback(
    async (err, proposals = []) => {
      if (err || !proposals) {
        return
      }

      const transformedProposals = await Promise.all(
        proposals.map(p => transformProposalData(p, config))
      )
      setProposals(transformedProposals)
    },
    [config]
  )

  useEffect(() => {
    if (!connector) {
      return
    }

    proposalsSubscription.current = connector.onProposals(
      {
        first: filters.count.filter,
        ...filters.name.queryArgs,
        ...filters.ranking.queryArgs,
        ...filters.status.queryArgs,
        ...filters.type.queryArgs,
      },
      onProposalsHandler
    )

    return () => {
      proposalsSubscription.current = null
    }
  }, [
    connector,
    filters.count,
    filters.name,
    filters.proposalCount,
    filters.ranking,
    filters.status,
    filters.type,
    onProposalsHandler,
  ])

  return proposals
}

// TODO: Handle errors
export function useProposalSubscription(
  proposalId: number,
  appAddress: string
) {
  const { config, connector } = useGardenState()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)

  const rawProposalRef = useRef<unknown>(null)
  const proposalSubscription = useRef<unknown>(null)

  const onProposalHandler = useCallback(
    async (err, proposal) => {
      if (err || !proposal) {
        setLoading(false)
        return
      }

      const rawProposal = JSON.stringify(proposal)
      if (rawProposalRef?.current === rawProposal) {
        return
      }

      rawProposalRef.current = rawProposal

      // TODO: Ask Gabi about this. It requires jusr one param
      const transformedProposal = await transformProposalData(proposal, config)
      setProposal(transformedProposal)
      setLoading(false)
    },
    [config]
  )

  useEffect(() => {
    if (!connector || !proposalId || !appAddress) {
      return
    }

    proposalSubscription.current = connector.onProposal(
      { number: proposalId, appAddress },
      onProposalHandler
    )

    return () => {
      proposalSubscription.current = null
    }
  }, [appAddress, connector, onProposalHandler, proposalId])

  return [proposal, loading]
}

export function useSupporterSubscription(account: string) {
  console.log(`useSupporterSubscription`, account)

  const { connector } = useGardenState()
  const [supporter, setSupporter] = useState(null)
  const [loading, setLoading] = useState(true)

  const rawSupporterRef = useRef<unknown>(null)
  const supporterSubscription = useRef<unknown>(null)

  const onSupporterHandler = useCallback((err, supporter) => {
    if (err || !supporter) {
      setSupporter(null)
      setLoading(false)
      return
    }

    const rawSupporter = JSON.stringify(supporter)
    if (rawSupporterRef?.current === rawSupporter) {
      return
    }

    rawSupporterRef.current = rawSupporter

    const transformedSupported = transformSupporterData(supporter)
    setSupporter(transformedSupported)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!connector || !account) {
      return
    }

    supporterSubscription.current = connector.onSupporter(
      { id: account.toLowerCase() },
      onSupporterHandler
    )

    return () => {
      supporterSubscription.current = null
    }
  }, [account, connector, onSupporterHandler])

  return [supporter, loading]
}
