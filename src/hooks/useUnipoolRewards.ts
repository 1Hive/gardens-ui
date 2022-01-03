import { useEffect, useState } from 'react'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useContractReadOnly } from '@hooks/useContract'
import { useMounted } from './useMounted'
import { useWallet } from '@providers/Wallet'
import BigNumber from '@lib/bigNumber'
import unipoolAbi from '@abis/Unipool.json'

export default function useUnipoolRewards() {
  const [earned, setEarned] = useState(new BigNumber(0))
  const mounted = useMounted()

  const { account } = useWallet()
  const { chainId, rewardsLink, unipool } = useConnectedGarden()
  const unipoolContract = useContractReadOnly(unipool, unipoolAbi, chainId)

  useEffect(() => {
    if (!unipoolContract || !account) {
      return
    }

    let timer: number
    const fetchEarned = async () => {
      try {
        const earned = await unipoolContract.earned(account)
        if (mounted()) {
          setEarned(earned)
        }
      } catch (err) {
        console.error(`Error fetching earned rewards: ${err}`)
      }

      timer = window.setTimeout(fetchEarned, 5000)
    }

    fetchEarned()

    return () => {
      clearTimeout(timer)
    }
  }, [account, mounted, unipoolContract])

  return [earned, rewardsLink]
}
