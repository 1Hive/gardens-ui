import { useCallback, useEffect, useRef, useState } from 'react'
import {
  transformConfigData,
  transformProposalData,
  transformSupporterData,
} from '../lib/data-utils'
import { useAppState } from '../providers/AppState'

export function useConfigSubscription(honeypot) {
  const [config, setConfig] = useState(null)

  const configSubscription = useRef(null)

  const onConfigHandler = useCallback((err, config) => {
    if (err || !config) {
      return
    }
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
  const { honeypot } = useAppState()
  const [proposals, setProposals] = useState([])

  const proposalsSubscription = useRef(null)

  const onProposalsHandler = useCallback((err, proposals = []) => {
    if (err || !proposals) {
      return
    }

    const transformedProposals = proposals.map(transformProposalData)
    setProposals(transformedProposals)
  }, [])

  useEffect(() => {
    if (!honeypot) {
      return
    }

    proposalsSubscription.current = honeypot.onProposals(
      {
        first: filters.proposalCount,
        ...filters.ranking.queryArgs,
        ...filters.status.queryArgs,
        ...filters.type.queryArgs,
      },
      onProposalsHandler
    )

    return () => proposalsSubscription.current.unsubscribe()
  }, [
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
  const { honeypot } = useAppState()
  const [proposal, setProposal] = useState(null)

  const proposalSubscription = useRef(null)

  const onProposalHandler = useCallback((err, proposal) => {
    if (err || !proposal) {
      return
    }

    const transformedProposal = transformProposalData(proposal)
    setProposal(transformedProposal)
  }, [])

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

  return proposal
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
