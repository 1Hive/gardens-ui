import { useEffect, useState } from 'react'
import useActions from '@hooks/useActions'
import { hexToUtf8 } from '@utils/web3-utils'
import { getProfileForAccount } from '@lib/profile'

export default function useChallenge(proposal) {
  const { agreementActions } = useActions()

  const [challenge, setChallenge] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!proposal) {
      return
    }
    async function getChallengeData() {
      const challengeData = await agreementActions.getChallenge(
        proposal.challengeId
      )
      const challengerProfile = await getProfileForAccount(
        challengeData.challenger
      )

      setChallenge({
        context: hexToUtf8(challengeData.context),
        challenger: { address: challengeData.challenger, ...challengerProfile },
      })
      setLoading(false)
    }

    getChallengeData()
  }, [proposal.challengeId])

  return { challenge, loading }
}
