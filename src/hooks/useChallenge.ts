// @ts-nocheck
// TODO: Ask Gabi where I can test this

import { useEffect, useState } from 'react'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useContractReadOnly } from './useContract'
import { useGardenState } from '@providers/GardenState'
import { useMounted } from './useMounted'
import { getProfileForAccount } from '@lib/profile'
import { hexToUtf8 } from '@utils/web3-utils'
import agreementAbi from '../abi/agreement.json'

export default function useChallenge(proposal) {
  console.log(`useChallenge`)
  console.log(proposal)
  const { chainId } = useConnectedGarden()
  const { connectedAgreementApp } = useGardenState()
  const mounted = useMounted()

  const agreementContract = useContractReadOnly(
    connectedAgreementApp.address,
    agreementAbi,
    chainId
  )

  console.log(`useChallenge`, agreementContract)

  const [challenge, setChallenge] = useState<{
    context: string | null
    challenger: any
  }>({
    context: null,
    challenger: null,
  })
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
