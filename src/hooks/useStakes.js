import { useMemo } from 'react'
import useUser from './useUser'
import {
  PROPOSAL_STATUS_ACTIVE_STRING,
  PROPOSAL_STATUS_CANCELLED_STRING,
  PROPOSAL_STATUS_CHALLENGED_STRING,
  PROPOSAL_STATUS_DISPUTED_STRING,
  PROPOSAL_STATUS_EXECUTED_STRING,
} from '../constants'
import { useGardenState } from '@providers/GardenState'
import { useSupporterSubscription } from './useSubscriptions'
import { ProposalTypes } from '../types'

export function useAccountStakes(account) {
  const user = useUser(account)

  return useMemo(() => {
    if (!user?.supports.length) {
      return []
    }

    return user.supports
      .flatMap(({ stakes }) => stakes)
      .reduce((acc, stake) => {
        if (
          stake.amount.eq(0) ||
          (stake.proposal.status !== PROPOSAL_STATUS_ACTIVE_STRING &&
            stake.proposal.status !== PROPOSAL_STATUS_CHALLENGED_STRING &&
            stake.proposal.status !== PROPOSAL_STATUS_DISPUTED_STRING)
        ) {
          return acc
        }

        return [
          ...acc,
          {
            amount: stake.amount,
            gardenId: stake.proposal.organization.id,
            proposalId: stake.proposal.id,
            proposalName: stake.proposal.name,
          },
        ]
      }, [])
  }, [user])
}

export function useAccountStakesByGarden(account) {
  const { connector } = useGardenState()
  const supporter = useSupporterSubscription(connector, account)

  return useMemo(() => {
    if (!supporter) {
      return []
    }

    return supporter.stakes.reduce((acc, stake) => {
      if (
        stake.amount.eq(0) ||
        (stake.proposal.status !== PROPOSAL_STATUS_ACTIVE_STRING &&
          stake.proposal.status !== PROPOSAL_STATUS_CHALLENGED_STRING &&
          stake.proposal.status !== PROPOSAL_STATUS_DISPUTED_STRING)
      ) {
        return acc
      }

      return [
        ...acc,
        {
          amount: stake.amount,
          proposalId: stake.proposal.id,
          proposalName: stake.proposal.name,
        },
      ]
    }, [])
  }, [supporter])
}

export function useInactiveProposalsWithStake(account) {
  const user = useUser(account)

  if (!user?.supports.length) {
    return []
  }

  const inactiveStakes = user.supports
    .flatMap(({ stakes }) => stakes)
    .filter(stake => {
      return (
        stake.proposal.type !== ProposalTypes.Decision &&
        (stake.proposal.status === PROPOSAL_STATUS_CANCELLED_STRING ||
          stake.proposal.status === PROPOSAL_STATUS_EXECUTED_STRING) &&
        stake.amount.gt(0)
      )
    })

  return inactiveStakes
}
