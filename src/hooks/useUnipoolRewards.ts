import { useEffect, useState } from 'react'
import { useConnectedGarden } from '@providers/ConnectedGarden'
import { useContractReadOnly } from '@hooks/useContract'
import { useMounted } from './useMounted'
import { useWallet } from '@providers/Wallet'
import BigNumber from '@lib/bigNumber'
import unipoolAbi from '@abis/Unipool.json'

const REWARD_DURATION = 2592000

export default function useUnipoolRewards() {
  const [earned, setEarned] = useState(new BigNumber(0))
  const [rewardAPR, setRewardAPR] = useState(new BigNumber(0))
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

  useEffect( () => {
    if (!unipoolContract || !account) {
      return
    }

    const fetchRewardAPR = async () => {
      try {
        const rewardRateResult = await unipoolContract.rewardRate()
        // Contract value is bn.js so we need to convert it to bignumber.js
        const rewardRate = new BigNumber(rewardRateResult.toString())

        const totalSupplyResult = await unipoolContract.totalSupply()
        // Contract value is bn.js so we need to convert it to bignumber.js
        const totalSupply = new BigNumber(totalSupplyResult.toString())

        const rewardAPRRaw = rewardRate.multipliedBy(REWARD_DURATION * 12).dividedBy(totalSupply)        
        
        if (mounted()) {
           setRewardAPR(rewardAPRRaw)
        }
      } catch (err) {
        console.error(`Error fetching reward APY: ${err}`)
      }
    }

    fetchRewardAPR()
    
  }, [unipoolContract, REWARD_DURATION])

  return [earned, rewardsLink, rewardAPR]
}
