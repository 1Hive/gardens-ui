import { IPFS_ENDPOINT } from './endpoints'

export async function fetchPic(buffer) {
  const res = await fetch(IPFS_ENDPOINT.upload, {
    method: 'post',
    'Content-Type': 'multipart/form-data',
    body: buffer,
  })

  return res.json()
}
