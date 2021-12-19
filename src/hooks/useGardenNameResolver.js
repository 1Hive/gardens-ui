import { useEffect, useState } from 'react'

import { useWallet } from '@providers/Wallet'

import { isAddress } from '@utils/web3-utils'

const ARAGON_DOMAIN = 'aragonid.eth'

export default function useGardenNameResolver(gardenId) {
  const [gardenAddress, setGardenAddress] = useState('')
  const { ethers } = useWallet()

  useEffect(() => {
    if (!gardenId || isAddress(gardenId)) {
      setGardenAddress(gardenId || '')
      return
    }

    const resolveName = async () => {
      try {
        const address = await ethers.resolveName(`${gardenId}.${ARAGON_DOMAIN}`)
        setGardenAddress(address)
      } catch (err) {
        console.error(`Error resolving garden name: ${err}`)
      }
    }

    resolveName()
  }, [ethers, gardenId])

  return gardenAddress
}
