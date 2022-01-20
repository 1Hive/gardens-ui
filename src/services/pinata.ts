import env from '@/environment'

const MIDDLEWARE_ENDPOINT = env('MIDDLEWARE_ENDPOINT')
const ENDPOINT = `${MIDDLEWARE_ENDPOINT}/v1/pinata/pinFileToIPFS`

export async function uploadToPinata(file: Blob) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const result = await fetch(ENDPOINT, {
      // Your POST endpoint
      method: 'POST',
      body: formData,
    })

    const data = await result.json()
    return { data, error: !result.ok }
  } catch (error) {
    console.error(error)
    return { error: true }
  }
}
