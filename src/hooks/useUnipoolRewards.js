import { useEffect, useState } from 'react'
import { useContractReadOnly } from '@hooks/useContract'
import { useGardens } from '@providers/Gardens'
import { useMounted } from './useMounted'
import { useWallet } from '@providers/Wallet'

import BigNumber from '@lib/bigNumber'
import unipoolAbi from '@abis/Unipool.json'

export default function useUnipoolRewards() {
  const [earned, setEarned] = useState(new BigNumber(0))
  const mounted = useMounted()

  const { account } = useWallet()

  const {
    connectedGarden: { unipool },
  } = useGardens()

  const unipoolContract = useContractReadOnly(unipool, unipoolAbi)

  useEffect(() => {
    let timer
    const fetchEarned = async () => {
      try {
        const earned = await unipoolContract.earned(account)
        if (mounted()) {
          setEarned(earned)
        }
      } catch (err) {
        console.error(`Error fetching earned rewards: ${err}`)
      }

      timer = setTimeout(fetchEarned, 5000)
    }

    fetchEarned()

    return () => {
      clearTimeout(timer)
    }
  }, [account, mounted, unipoolContract])

  return earned
}
