import isIPFS from 'is-ipfs'
import { getNetwork } from '../networks'

const REQUEST_TIMEOUT = 60000

export async function ipfsGet(cid) {
  const ipfsGateway = getNetwork().ipfsGateway
  const endpoint = `${ipfsGateway}/${cid}`

  try {
    const result = await fetch(endpoint, { timeout: REQUEST_TIMEOUT })
    const data = await result.text()

    return { data, error: !result.ok }
  } catch (err) {
    console.error(`Error requesting data from IPFS for ${endpoint}`, err)
    return { error: true }
  }
}

export function getIpfsCidFromUri(uri) {
  const ipfsCid = uri.replace(/^ipfs:/, '')

  if (isIPFS.cid(ipfsCid) || isIPFS.cidPath(ipfsCid)) {
    return ipfsCid
  }
  return ''
}

export function getIpfsUrlFromUri(uri) {
  const ipfsGateway = getNetwork().ipfsGateway
  return `${ipfsGateway}/${getIpfsCidFromUri(uri)}`
}
