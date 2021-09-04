import env from '@/environment'

const ENDPOINT = 'https://api.pinata.cloud/pinning/pinFileToIPFS'
const PINATA_API_TOKEN = env('PINATA_API_TOKEN')

export async function uploadToPinata(file) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const result = await fetch(ENDPOINT, {
      // Your POST endpoint
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_API_TOKEN}`,
      },
      body: formData,
    })

    const data = await result.json()
    return { data, error: !result.ok }
  } catch (error) {
    console.error(error)
    return { error: true }
  }
}
