import { Core } from '@self.id/core'
import { EthereumAuthProvider, SelfID, WebClient } from '@self.id/web'

// yarn add 3id-did-provider @ceramicnetwork/http-client @3id/connect @self.id/core @self.id/web

async function webClient() {
  let address = null
  const ethereum = window.ethereum

  if (!ethereum) {
    return {
      error: 'No ethereum wallet detected',
    }
  }

  if (!address) {
    address = await ethereum.request({ method: 'eth_requestAccounts' })
  }

  const client = new WebClient({
    ceramic: 'testnet-clay',
    connectNetwork: 'testnet-clay',
  })

  const provider = new EthereumAuthProvider(window.ethereum, address[0])
  await client.authenticate(provider)
  const selfId = new SelfID({ client })

  return {
    client,
    selfId,
    id: selfId.id,
    error: null,
  }
}

async function getRecord() {
  let address = null
  const ethereum = window.ethereum

  if (!ethereum) {
    return {
      error: 'No ethereum wallet detected',
    }
  }

  if (!address) {
    address = await ethereum.request({ method: 'eth_requestAccounts' })
  }

  const client = new Core({ ceramic: 'testnet-clay' })
  const did = await client.getAccountDID(`${address[0]}@eip155:1`)

  return {
    record: await client.get('basicProfile', did),
    error: null,
  }
}

export { webClient, getRecord }
