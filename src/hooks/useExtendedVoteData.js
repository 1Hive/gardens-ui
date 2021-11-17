import { useMemo } from 'react'

import { useBlockTimeStamp } from './useBlock'
import { useContractReadOnly } from './useContract'
import { useGardenState } from '@providers/GardenState'
import usePromise from './usePromise'
import { useUserState } from '@providers/User'
import { useWallet } from '@providers/Wallet'

import { getCanUserVote, getCanUserVoteOnBehalfOf } from '@utils/vote-utils'
import { getUserBalanceAt, getUserBalanceNow } from '@utils/token-utils'
import minimeTokenAbi from '@abis/minimeToken.json'
import votingAbi from '@abis/voting.json'
import { addressesEqual } from '@/utils/web3-utils'

const emptyPromise = defaultValue =>
  new Promise(resolve => resolve(defaultValue))

export default function useExtendedVoteData(vote) {
  const { canExecute, canExecutePromise } = useCanExecute(vote)
  // Can user vote
  const { canUserVote, canUserVotePromise } = useCanUserVote(vote)
  // Can user vote on behalf of
  const {
    canUserVoteOnBehalfOf,
    canUserVoteOnBehalfOfPromise,
  } = useCanUserVoteOnBehalfOf(vote)
  // Princiapls balances
  const { principalsBalance, principalsBalancePromise } = usePrincipalsBalance(
    vote
  )
  // User balance
  const {
    userBalance,
    userBalancePromise,
    userBalanceNow,
    userBalanceNowPromise,
  } = useUserBalance(vote)

  const startTimestamp = useBlockTimeStamp(vote.startBlock)

  return {
    canExecute,
    canExecutePromise,
    canUserVote,
    canUserVotePromise,
    canUserVoteOnBehalfOf,
    canUserVoteOnBehalfOfPromise,
    principalsBalance,
    principalsBalancePromise,
    startTimestamp,
    userBalance,
    userBalancePromise,
    userBalanceNow,
    userBalanceNowPromise,
  }
}

function useCanExecute(vote) {
  const { config } = useGardenState()
  const { id: votingAddress } = config.voting

  const votingContract = useContractReadOnly(votingAddress, votingAbi)
  // Can execute
  const canExecutePromise = useMemo(() => {
    if (!votingContract) {
      return
    }
    return votingContract.canExecute(vote.id)
  }, [votingContract, vote])
  const canExecute = usePromise(canExecutePromise, [], false)

  return { canExecute, canExecutePromise }
}

export function useCanUserVote(vote) {
  const { config } = useGardenState()
  const { account: connectedAccount } = useWallet()
  const { id: votingAddress } = config?.voting || {}

  const votingContract = useContractReadOnly(votingAddress, votingAbi)

  const canUserVotePromise = useMemo(() => {
    return getCanUserVote(votingContract, vote.id, connectedAccount)
  }, [connectedAccount, votingContract, vote])

  const canUserVote = usePromise(canUserVotePromise, [], false)

  return { canUserVote, canUserVotePromise }
}

function useCanUserVoteOnBehalfOf(vote) {
  const { config } = useGardenState()
  const { account: connectedAccount } = useWallet()
  const { id: votingAddress } = config?.voting || {}
  const principals = useUserPrincipalsByGarden(config.id, vote.id)
  const votingContract = useContractReadOnly(votingAddress, votingAbi)

  const canUserVoteOnBehalfOfPromise = useMemo(() => {
    return getCanUserVoteOnBehalfOf(
      votingContract,
      vote.id,
      principals,
      connectedAccount
    )
  }, [connectedAccount, principals, votingContract, vote])

  const canUserVoteOnBehalfOf = usePromise(
    canUserVoteOnBehalfOfPromise,
    [],
    false
  )

  return { canUserVoteOnBehalfOf, canUserVoteOnBehalfOfPromise }
}

function usePrincipalsBalance(vote) {
  const { config } = useGardenState()
  const { token } = config.voting
  const principals = useUserPrincipalsByGarden(config.id, vote.id)
  const tokenContract = useContractReadOnly(token.id, minimeTokenAbi)

  // User balance
  const principalsBalancePromise = useMemo(() => {
    if (!vote?.id || !principals.length) {
      return emptyPromise([])
    }
    return Promise.all(
      principals.map(principal =>
        getUserBalanceAt(
          principal,
          vote.snapshotBlock,
          tokenContract,
          token.decimals
        )
      )
    )
  }, [principals, tokenContract, token.decimals, vote.id, vote.snapshotBlock])
  const principalsBalancesResult = usePromise(principalsBalancePromise, [], [])

  const principalsBalance = useMemo(
    () =>
      principalsBalancesResult.reduce(
        (acc, balance) => acc + Math.max(0, balance),
        -1
      ),
    [principalsBalancesResult]
  )

  return { principalsBalance, principalsBalancePromise }
}

function useUserBalance(vote) {
  const { account: connectedAccount } = useWallet()
  const { config } = useGardenState()
  const { token } = config.voting
  const tokenContract = useContractReadOnly(token.id, minimeTokenAbi)

  // User balance
  const userBalancePromise = useMemo(() => {
    if (!vote?.id) {
      return emptyPromise(-1)
    }
    return getUserBalanceAt(
      connectedAccount,
      vote.snapshotBlock,
      tokenContract,
      token.decimals
    )
  }, [
    connectedAccount,
    tokenContract,
    token.decimals,
    vote.id,
    vote.snapshotBlock,
  ])
  const userBalance = usePromise(userBalancePromise, [], -1)

  // User balance now
  const userBalanceNowPromise = useMemo(
    () => getUserBalanceNow(connectedAccount, tokenContract, token.decimals),
    [connectedAccount, tokenContract, token.decimals]
  )
  const userBalanceNow = usePromise(userBalanceNowPromise, [], -1)

  return {
    userBalance,
    userBalancePromise,
    userBalanceNow,
    userBalanceNowPromise,
  }
}

function useUserPrincipalsByGarden(gardenAddress, voteId) {
  const { user } = useUserState()

  // We´ll get all the user principals for the given garden that haven´t already voted
  const principals = useMemo(
    () =>
      user?.representativeFor
        .filter(
          principal =>
            addressesEqual(principal.organization.id, gardenAddress) &&
            principal.casts.findIndex(
              cast => cast.proposal.number === voteId
            ) === -1
        )
        .map(principal => principal.user.address),
    [gardenAddress, user, voteId]
  )

  return principals
}
