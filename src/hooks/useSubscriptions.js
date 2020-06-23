import { useCallback, useEffect, useRef, useState } from 'react'
import {
  transformProposalData,
  transformStakeHistoryData,
} from '../lib/data-utils'

export function useProposalsSubscription(convictionVoting) {
  const [proposals, setProposals] = useState([])

  const proposalsSubscription = useRef(null)

  const onProposalsHandler = useCallback((proposals = []) => {
    const transformedProposals = proposals.map(transformProposalData)
    setProposals(transformedProposals)
  }, [])

  useEffect(() => {
    if (!convictionVoting) {
      return
    }

    proposalsSubscription.current = convictionVoting.onProposals(
      onProposalsHandler
    )

    return () => proposalsSubscription.current[0]()
  }, [convictionVoting, onProposalsHandler])

  return proposals
}

export function useStakesHistorySubscription(convictionVoting) {
  const [stakes, setStakes] = useState([])

  const stakesSubscription = useRef(null)

  const onStakesHandler = useCallback((stakes = []) => {
    const transformedStakes = stakes.map(transformStakeHistoryData)
    setStakes(transformedStakes)
  }, [])

  useEffect(() => {
    if (!convictionVoting) {
      return
    }

    stakesSubscription.current = convictionVoting.onStakesHistory(
      onStakesHandler
    )

    return () => {
      stakesSubscription.current[0]()
    }
  }, [convictionVoting, onStakesHandler])

  return stakes
}
