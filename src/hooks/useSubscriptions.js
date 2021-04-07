import { useCallback, useEffect, useRef, useState } from 'react'
import {
  transformConfigData,
  transformProposalData,
  transformSupporterData,
} from '../utils/data-utils'
import { useAppState } from '../providers/AppState'

export function useConfigSubscription(honeypot) {
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
    if (!honeypot) {
      return
    }

    configSubscription.current = honeypot.onConfig(onConfigHandler)

    return () => configSubscription.current.unsubscribe()
  }, [honeypot, onConfigHandler])

  return config
}

export function useProposalsSubscription(filters) {
  const { honeypot, config } = useAppState()
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
    if (!honeypot) {
      return
    }

    proposalsSubscription.current = honeypot.onProposals(
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
    honeypot,
    onProposalsHandler,
  ])

  return proposals
}

// TODO: Handle errors
export function useProposalSubscription(proposalId, appAddress) {
  const { honeypot, config } = useAppState()
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
    if (!honeypot || !proposalId || !appAddress) {
      return
    }

    proposalSubscription.current = honeypot.onProposal(
      { number: proposalId, appAddress },
      onProposalHandler
    )

    return () => proposalSubscription.current.unsubscribe()
  }, [appAddress, honeypot, onProposalHandler, proposalId])

  return [proposal, loading]
}

export function useSupporterSubscription(honeypot, account) {
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
    if (!honeypot || !account) {
      return
    }

    supporterSubscription.current = honeypot.onSupporter(
      { id: account.toLowerCase() },
      onSupporterHandler
    )

    return () => {
      supporterSubscription.current.unsubscribe()
    }
  }, [account, honeypot, onSupporterHandler])

  return supporter
}
