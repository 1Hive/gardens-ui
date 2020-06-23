import { useCallback, useEffect, useRef, useState } from 'react'
import {
  transformProposalData,
  transformStakeHistoryData,
} from '../lib/data-utils'

export function useProposalsSubscription(conviction) {
  const [proposals, setProposals] = useState([])

  const proposalsSubscription = useRef(null)

  const onProposalsHandler = useCallback((proposals = []) => {
    console.log('proposals', proposals)
    const transformedProposals = proposals.map(transformProposalData)
    setProposals(transformedProposals)
  }, [])

  useEffect(() => {
    if (!conviction) {
      return
    }

    proposalsSubscription.current = conviction.onProposals(onProposalsHandler)

    return () => proposalsSubscription.current.unsubscribe()
  }, [conviction, onProposalsHandler])

  return proposals
}

export function useStakesHistorySubscription(conviction) {
  const [stakes, setStakes] = useState([])

  const stakesSubscription = useRef(null)

  const onStakesHandler = useCallback((stakes = []) => {
    const transformedStakes = stakes.map(transformStakeHistoryData)
    setStakes(transformedStakes)
  }, [])

  useEffect(() => {
    if (!conviction) {
      return
    }

    stakesSubscription.current = conviction.onProposals(onStakesHandler)

    return () => stakesSubscription.current.unsubscribe()
  }, [conviction, onStakesHandler])

  return stakes
}
