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

export async function twitterVerification(account, did) {
  try {
    const response = await fetch('https://verifications.3box.io/twitter', {
      method: 'POST',
      body: JSON.stringify({
        did,
        twitter_handle: account,
      }),
    })

    if (!response.ok) {
      throw new Error('Verification failed')
    }

    const claim = await response.json()
    return claim
  } catch (err) {
    console.error(err)
    throw err
  }
}
