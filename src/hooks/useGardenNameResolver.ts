import { useEffect, useState } from 'react'
import {useGardens} from '@providers/Gardens'
import { useWallet } from '@providers/Wallet'
import { isAddress } from '@utils/web3-utils'

const ARAGON_DOMAIN = 'aragonid.eth'


// seems that the ens resolver is still no ready for L2 on ehters
// see https://github.com/ethers-io/ethers.js/issues/2003#issuecomment-1006249747
export default function useGardenNameResolver(gardenId: string) {
  const {gardens} = useGardens()
  // const [gardenAddress, setGardenAddress] = useState('')
  // const { ethers } = useWallet()

  // useEffect(() => {
  //   if (!gardenId || isAddress(gardenId)) {
  //     setGardenAddress(gardenId || '')
  //     return
  //   }

  //   const resolveName = async () => {
  //     try {
  //       const address = await ethers.resolveName(`${gardenId}.${ARAGON_DOMAIN}`)
  //       setGardenAddress(address)
  //     } catch (err) {
  //       console.error(`Error resolving garden name: ${err}`)
  //     }
  //   }

  //   resolveName()
  // }, [ethers, gardenId])

  return getGardenAddressByName(gardenId, gardens)
}

//TODO - remove this function once ethers support resolver on L2
function getGardenAddressByName(gardenName: string, gardens:[any]){
  const garden = gardens.find(g => g?.name?.toLowerCase() === gardenName.toLowerCase())
  return garden?.address
}