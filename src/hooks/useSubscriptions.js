import { useCallback, useEffect, useRef, useState } from 'react'
import {
  transformConfigData,
  transformProposalData,
  transformSupporterData,
} from '../utils/data-utils'
import { useGardenState } from '@providers/GardenState'

export function useConfigSubscription(garden) {
  const [config, setConfig] = useState(null)

  const rawConfigRef = useRef(null)
  const configSubscription = useRef(null)

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

    return () => configSubscription.current.unsubscribe()
  }, [garden, onConfigHandler])

  return config
}

export function useProposalsSubscription(filters) {
  const { garden, config } = useGardenState()
  const [proposals, setProposals] = useState([])

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
    if (!garden) {
      return
    }

    proposalsSubscription.current = garden.onProposals(
      {
        first: filters.count.filter,
        ...filters.name.queryArgs,
        ...filters.ranking.queryArgs,
        ...filters.status.queryArgs,
        ...filters.type.queryArgs,
      },
      onProposalsHandler
    )

    return () => proposalsSubscription.current.unsubscribe()
  }, [
    filters.count,
    filters.name,
    filters.proposalCount,
    filters.ranking,
    filters.status,
    filters.type,
    garden,
    onProposalsHandler,
  ])

  return proposals
}

// TODO: Handle errors
export function useProposalSubscription(proposalId, appAddress) {
  const { garden, config } = useGardenState()
  const [proposal, setProposal] = useState(null)
  const [loading, setLoading] = useState(true)

  const rawProposalRef = useRef(null)
  const proposalSubscription = useRef(null)

  const onProposalHandler = useCallback(
    async (err, proposal) => {
      if (err || !proposal) {
        setLoading(true)
        return
      }

      const rawProposal = JSON.stringify(proposal)
      if (rawProposalRef?.current === rawProposal) {
        return
      }

      rawProposalRef.current = rawProposal

      const transformedProposal = await transformProposalData(proposal, config)
      setProposal(transformedProposal)
      setLoading(false)
    },
    [config]
  )

  useEffect(() => {
    if (!garden || !proposalId || !appAddress) {
      return
    }

    proposalSubscription.current = garden.onProposal(
      { number: proposalId, appAddress },
      onProposalHandler
    )

    return () => proposalSubscription.current.unsubscribe()
  }, [appAddress, garden, onProposalHandler, proposalId])

  return [proposal, loading]
}

export function useSupporterSubscription(garden, account) {
  const [supporter, setSupporter] = useState(null)

  const supporterSubscription = useRef(null)

  const onSupporterHandler = useCallback((err, supporter) => {
    if (err || !supporter) {
      return
    }

    const transformedSupported = transformSupporterData(supporter)
    setSupporter(transformedSupported)
  }, [])

  useEffect(() => {
    if (!garden || !account) {
      return
    }

    supporterSubscription.current = garden.onSupporter(
      { id: account.toLowerCase() },
      onSupporterHandler
    )

    return () => {
      supporterSubscription.current.unsubscribe()
    }
  }, [account, garden, onSupporterHandler])

  return supporter
}
