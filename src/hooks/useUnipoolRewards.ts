import { useEffect, useState } from 'react'

import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useWallet } from '@providers/Wallet'

import { useContractReadOnly } from '@hooks/useContract'

import BigNumber from '@lib/bigNumber'

import unipoolAbi from '@abis/Unipool.json'

import { useMounted } from './useMounted'

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
