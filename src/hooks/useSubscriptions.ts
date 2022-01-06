import { useCallback, useEffect, useRef, useState } from 'react'
import { useGardenState } from '@providers/GardenState'
import {
  transformConfigData,
  transformProposalData,
  transformSupporterData,
} from '../utils/data-utils'
import { SupporterData } from '@1hive/connect-gardens/dist/cjs/types'
import { FiltersType } from './constants'

type Garden = {
  onConfig: any
}

export function useConfigSubscription(garden: Garden | null) {
  const [config, setConfig] = useState(null)

  const rawConfigRef = useRef<any>(null)
  const configSubscription = useRef<any>(null)

  const onConfigHandler = useCallback((err, config) => {
    if (err || !config) {
      return
    }

    const rawConfig = JSON.stringify(config)
    if (rawConfigRef?.current === rawConfig) {
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
      configSubscription.current.unsubscribe()
    }
  }, [garden, onConfigHandler])

  return config
}

export function useProposalsSubscription(filters: FiltersType) {
  const { config, connector } = useGardenState()
  const [proposals, setProposals] = useState<any>([])

  const proposalsSubscription = useRef<any>(null)

  const onProposalsHandler = useCallback(
    async (err, proposals = []) => {
      if (err || !proposals) {
        return
      }

      const transformedProposals = await Promise.all(
        proposals.map((p: any) => transformProposalData(p))
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
      proposalsSubscription.current.unsubscribe()
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

  const rawProposalRef = useRef<any>(null)
  const proposalSubscription = useRef<any>(null)

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

      const transformedProposal = await transformProposalData(proposal)
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
      proposalSubscription.current.unsubscribe()
    }
  }, [appAddress, connector, onProposalHandler, proposalId])

  return [proposal, loading]
}

export function useSupporterSubscription(account: string) {
  const { connector } = useGardenState()
  const [supporter, setSupporter] = useState<SupporterData | null>(null)
  const [loading, setLoading] = useState(true)

  const rawSupporterRef = useRef<any>(null)
  const supporterSubscription = useRef<any>(null)

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
      supporterSubscription.current?.unsubscribe()
    }
  }, [account, connector, onSupporterHandler])

  return { supporter, loading }
}
