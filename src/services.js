import { IPFS_ENDPOINT } from './endpoints'

export async function fetchPic(buffer) {
  try {
    const rawResponse = await fetch(IPFS_ENDPOINT.upload, {
      method: 'post',
      'Content-Type': 'multipart/form-data',
      body: buffer,
    })

    if (rawResponse.ok) {
      const data = await rawResponse.json()
      return { data, error: null }
    }

    return {
      error: new Error(
        `Could not upload pic ${rawResponse.status}: ${rawResponse.statusText}`
      ),
    }
  } catch (err) {
    return { error: err }
  }
}
