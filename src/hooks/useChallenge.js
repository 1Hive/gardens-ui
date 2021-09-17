import { useEffect, useState } from 'react'

import { useContractReadOnly } from './useContract'
import { useGardenState } from '@providers/GardenState'
import { useMounted } from './useMounted'

import { getProfileForAccount } from '@lib/profile'
import { hexToUtf8 } from '@utils/web3-utils'

import agreementAbi from '../abi/agreement.json'

export default function useChallenge(proposal) {
  const { connectedAgreementApp } = useGardenState()
  const mounted = useMounted()

  const agreementContract = useContractReadOnly(
    connectedAgreementApp.address,
    agreementAbi
  )

  const [challenge, setChallenge] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!proposal) {
      return
    }
    async function getChallengeData() {
      const challengeData = await agreementContract.getChallenge(
        proposal.challengeId
      )
      const challengerProfile = await getProfileForAccount(
        challengeData.challenger
      )
      if (mounted()) {
        setChallenge({
          context: hexToUtf8(challengeData.context),
          challenger: {
            address: challengeData.challenger,
            ...challengerProfile,
          },
        })
      }
      setLoading(false)
    }

    getChallengeData()
  }, [agreementContract, mounted, proposal])

  return { challenge, loading }
}
