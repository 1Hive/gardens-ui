import { DID } from 'dids'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import Ceramic from '@ceramicnetwork/http-client'
import {
  ThreeIdConnect,
  EthereumAuthProvider,
  AuthProvider,
} from '@3id/connect'
import { IDX } from '@ceramicstudio/idx'
// import { getEthersNetwork } from '@/networks'
// import { providers } from 'ethers'
import { useWallet } from 'use-wallet'
import Web3Modal from 'web3modal'
import Web3 from 'web3'

export const threeID = new ThreeIdConnect()

// const endpoint = 'https://ceramic-clay.3boxlabs.com'
const endpoint = 'https://gateway-clay.ceramic.network'
// const endpoint = 'https://gateway-dev.ceramic.network'

declare global {
  interface Window {
    didProvider: any
  }
}

export const connectCeramic = () => {
  const ceramic = new Ceramic(endpoint)
  const idx = new IDX({ ceramic })

  return {
    ceramic,
    idx,
  }
}

const olduseCeramic = () => {
  const { ethereum, account } = useWallet()

  async function connect(): Promise<AuthProvider> {
    // const web3Modal = new Web3Modal({
    //   network: 'rinkeby',
    //   cacheProvider: false,
    //   providerOptions: {
    //     injected: {
    //       package: null,
    //     },
    //     // walletconnect: {
    //     //   package: WalletConnectProvider,
    //     //   options: {
    //     //     infuraId: INFURA_TOKEN,
    //     //   },
    //     // },
    //   },
    // })
    // console.log('web3Modal.connect')
    // const provider = await web3Modal.connect()
    // const provider = ethereum
    // const web3 = new Web3(ethereum)
    // console.log('web3', web3)
    // const accounts = await web3.eth.getAccounts()
    console.log('account', account)
    return new EthereumAuthProvider(ethereum, account + '')
  }

  const connectProfile = async () => {
    console.log(`connectProfile`)

    // if (!account) return console.log(`No account!`)

    // const { idx } = connectCeramic()

    // try {
    //   const data = await idx.get('basicProfile', `${account}@eip155:1`)

    //   return data
    // } catch (error) {
    //   console.log(error)
    createProfile()
    // }

    return null
  }

  const createProfile = async () => {
    console.log(`createProfile`)

    // if (!account) return console.log(`No account!`)

    const { ceramic, idx } = connectCeramic()
    console.log(`post connectCeramic`)

    // const provider = new providers.Web3Provider(
    //   ethereum,
    //   getEthersNetwork(chainId)
    // )
    // provider.

    const threeIdConnect = new ThreeIdConnect(endpoint)
    // new EthereumAuthProvider(ethereum, account)
    const authProvider = await connect()
    await threeIdConnect.connect(authProvider)
    // const authProvider = undefined
    console.log(`post connect`)
    const didProvider = threeIdConnect.getDidProvider()
    // await threeIdConnect.connect(authProvider)
    window.didProvider = didProvider
    const did = new DID({
      provider: didProvider,
      resolver: {
        ...ThreeIdResolver.getResolver(ceramic),
      },
    })

    console.log(`did`, did)

    console.log(`did.authenticated`, did.authenticated)

    const auth = await did.authenticate({ provider: window.ethereum })
    console.log(`did.authenticate`, auth)
    await ceramic.setDID(did)

    await idx.set('basicProfile', {
      name: 'felipe',
    })
  }

  return {
    connectProfile,
    createProfile,
  }
}

export default olduseCeramic
