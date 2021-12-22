import { useEffect, useState } from 'react'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useContractReadOnly } from './useContract'
import { useGardenState } from '@providers/GardenState'
import { useMounted } from './useMounted'
import { getProfileForAccount } from '@lib/profile'
import { hexToUtf8 } from '@utils/web3-utils'
import agreementAbi from '../abi/agreement.json'
import { ProposalType } from './constants'

export default function useChallenge(proposal: ProposalType) {
  const { chainId } = useConnectedGarden()
  const { connectedAgreementApp } = useGardenState()
  const mounted = useMounted()

  const agreementContract = useContractReadOnly(
    connectedAgreementApp.address,
    agreementAbi,
    chainId
  )

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
      if (agreementContract === null) return

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
